from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from threading import Lock
from typing import Any, Dict, List, Optional, Union
from uuid import uuid4

from supabase import Client, create_client
from supabase.lib.client_options import ClientOptions

from app.config import get_settings

JsonValue = Union[str, int]
AnswerRow = Dict[str, JsonValue]
Answers = List[AnswerRow]


@dataclass
class User:
    id: str
    email: str
    full_name: Optional[str]
    created_at: str


@dataclass
class PreRegistration:
    id: str
    user_id: str
    status: str
    created_at: str


class InMemoryRepository:
    def __init__(self) -> None:
        self._lock = Lock()
        self.users: Dict[str, User] = {}
        self.users_by_email: Dict[str, str] = {}
        self.pre_registrations: Dict[str, PreRegistration] = {}
        self.responses: Dict[str, Answers] = {}
        self.course_surveys: Dict[str, Dict[str, Any]] = {}

    @staticmethod
    def _now_iso() -> str:
        return datetime.now(timezone.utc).isoformat()

    def get_or_create_user(self, email: str, full_name: Optional[str]) -> User:
        with self._lock:
            user_id = self.users_by_email.get(email)
            if user_id:
                current = self.users[user_id]
                if full_name and current.full_name != full_name:
                    current.full_name = full_name
                return current
            user = User(id=str(uuid4()), email=email, full_name=full_name, created_at=self._now_iso())
            self.users[user.id] = user
            self.users_by_email[email] = user.id
            return user

    def get_user(self, user_id: str) -> Optional[User]:
        return self.users.get(user_id)

    def create_pre_registration(self, user_id: str) -> PreRegistration:
        with self._lock:
            for pre in self.pre_registrations.values():
                if pre.user_id == user_id:
                    return pre
            pre = PreRegistration(
                id=str(uuid4()),
                user_id=user_id,
                status="pending_questionnaire",
                created_at=self._now_iso(),
            )
            self.pre_registrations[pre.id] = pre
            return pre

    def get_pre_registration_by_user(self, user_id: str) -> Optional[PreRegistration]:
        for pre in self.pre_registrations.values():
            if pre.user_id == user_id:
                return pre
        return None

    def save_questionnaire(self, user_id: str, answers: Answers) -> None:
        with self._lock:
            self.responses[user_id] = answers
            pre = self.get_pre_registration_by_user(user_id)
            if pre:
                pre.status = "completed"

    def get_questionnaire(self, user_id: str) -> Answers:
        return self.responses.get(user_id, [])

    def save_course_survey(self, survey: Dict[str, Any]) -> None:
        with self._lock:
            email = str(survey["institutional_email"]).strip().lower()
            payload = dict(survey)
            payload["institutional_email"] = email
            self.course_surveys[email] = payload


class SupabaseRepository:
    def __init__(self, client: Client) -> None:
        self.client = client

    def get_or_create_user(self, email: str, full_name: Optional[str]) -> User:
        found = self.client.table("users").select("id,email,full_name,created_at").eq("email", email).limit(1).execute()
        if found.data:
            row = found.data[0]
            if full_name and row.get("full_name") != full_name:
                self.client.table("users").update({"full_name": full_name}).eq("id", row["id"]).execute()
                row["full_name"] = full_name
            return User(
                id=str(row["id"]),
                email=str(row["email"]),
                full_name=row.get("full_name"),
                created_at=str(row.get("created_at") or datetime.now(timezone.utc).isoformat()),
            )

        new_user = {
            "id": str(uuid4()),
            "email": email,
            "full_name": full_name,
        }
        inserted = self.client.table("users").insert(new_user).execute()
        row = inserted.data[0]
        return User(
            id=str(row["id"]),
            email=str(row["email"]),
            full_name=row.get("full_name"),
            created_at=str(row.get("created_at") or datetime.now(timezone.utc).isoformat()),
        )

    def get_user(self, user_id: str) -> Optional[User]:
        result = self.client.table("users").select("id,email,full_name,created_at").eq("id", user_id).limit(1).execute()
        if not result.data:
            return None
        row = result.data[0]
        return User(
            id=str(row["id"]),
            email=str(row["email"]),
            full_name=row.get("full_name"),
            created_at=str(row.get("created_at") or datetime.now(timezone.utc).isoformat()),
        )

    def create_pre_registration(self, user_id: str) -> PreRegistration:
        existing = self.get_pre_registration_by_user(user_id)
        if existing:
            return existing
        inserted = (
            self.client.table("pre_registrations")
            .insert({"user_id": user_id, "status": "pending_questionnaire"})
            .execute()
        )
        row = inserted.data[0]
        return PreRegistration(
            id=str(row["id"]),
            user_id=str(row["user_id"]),
            status=str(row["status"]),
            created_at=str(row.get("created_at") or datetime.now(timezone.utc).isoformat()),
        )

    def get_pre_registration_by_user(self, user_id: str) -> Optional[PreRegistration]:
        result = (
            self.client.table("pre_registrations")
            .select("id,user_id,status,created_at")
            .eq("user_id", user_id)
            .limit(1)
            .execute()
        )
        if not result.data:
            return None
        row = result.data[0]
        return PreRegistration(
            id=str(row["id"]),
            user_id=str(row["user_id"]),
            status=str(row["status"]),
            created_at=str(row.get("created_at") or datetime.now(timezone.utc).isoformat()),
        )

    def save_questionnaire(self, user_id: str, answers: Answers) -> None:
        pre = self.create_pre_registration(user_id)
        self.client.table("questionnaire_responses").delete().eq("user_id", user_id).execute()
        rows = [
            {
                "user_id": user_id,
                "question_id": answer["question_id"],
                "answer": answer["answer"],
            }
            for answer in answers
        ]
        self.client.table("questionnaire_responses").insert(rows).execute()
        self.client.table("pre_registrations").update({"status": "completed"}).eq("id", pre.id).execute()

    def get_questionnaire(self, user_id: str) -> Answers:
        result = (
            self.client.table("questionnaire_responses")
            .select("question_id,answer")
            .eq("user_id", user_id)
            .order("question_id")
            .execute()
        )
        return [
            {"question_id": int(row["question_id"]), "answer": str(row["answer"])}
            for row in (result.data or [])
        ]

    def save_course_survey(self, survey: Dict[str, Any]) -> None:
        email = str(survey["institutional_email"]).strip().lower()
        pre_registration_id = None

        prereg_result = (
            self.client.table("pre_registrations")
            .select("id")
            .eq("institutional_email", email)
            .limit(1)
            .execute()
        )
        if prereg_result.data:
            pre_registration_id = prereg_result.data[0]["id"]

        payload = dict(survey)
        payload["institutional_email"] = email
        payload["pre_registration_id"] = pre_registration_id

        existing = (
            self.client.table("course_satisfaction_surveys")
            .select("id")
            .eq("institutional_email", email)
            .limit(1)
            .execute()
        )

        if existing.data:
            self.client.table("course_satisfaction_surveys").update(payload).eq("id", existing.data[0]["id"]).execute()
            return

        self.client.table("course_satisfaction_surveys").insert(payload).execute()


RepositoryType = Union[InMemoryRepository, SupabaseRepository]
_repo_singleton: Optional[RepositoryType] = None


def get_repository() -> RepositoryType:
    global _repo_singleton
    if _repo_singleton is not None:
        return _repo_singleton

    settings = get_settings()
    if settings.supabase_url and settings.supabase_key:
        options = ClientOptions(persist_session=False)
        client = create_client(settings.supabase_url, settings.supabase_key, options=options)
        _repo_singleton = SupabaseRepository(client)
    else:
        _repo_singleton = InMemoryRepository()

    return _repo_singleton
