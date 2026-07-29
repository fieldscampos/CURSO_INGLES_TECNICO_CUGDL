insert into public.questionnaire_questions (id, text, answer_type)
values
  (1, 'Por que tu interes en este curso?', 'texto_libre'),
  (2, 'Cual es tu expectativa en este curso?', 'texto_libre'),
  (3, 'Crees necesario que el CUGDL tenga materia de verano en programacion y base de datos?', 'texto_libre'),
  (4, 'Cuales son tus recomendaciones acerca de lo que sucede con las materias y temas en el CUGDL?', 'texto_libre')
on conflict (id) do update set text = excluded.text, answer_type = excluded.answer_type;

