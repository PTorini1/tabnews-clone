function status(request, response) {
  response
    .status(200)
    .json({ valor: "alunos do curso.dev são pessoas legais" });
}

export default status;
