import { useBooks } from "../context/BooksContext";
import { MenuItem, Select, Typography, Box, Card, CardContent } from "@mui/material";
import { useState } from "react";

export default function CourseFilter() {
  const { books } = useBooks();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  // Gera lista única de semestres ordenados
  const semesters = [...new Set(books.map((book) => book.semester))].sort(
    (a, b) => a - b
  );

  // Gera lista única de disciplinas, filtrada pelo semestre selecionado
  const courses = [
    ...new Set(
      books
        .filter(
          (book) =>
            selectedSemester === "" ||
            book.semester === Number(selectedSemester)
        )
        .map((book) => book.course)
    ),
  ].sort();

  // Filtra os livros com base nos dois filtros
  const filteredBooks = books.filter((book) => {
    const matchesSemester =
      selectedSemester === "" || book.semester === Number(selectedSemester);
    const matchesCourse =
      selectedCourse === "" || book.course === selectedCourse;
    return matchesSemester && matchesCourse;
  });

  // Ao trocar o semestre, reseta a disciplina selecionada
  const handleSemesterChange = (value: string) => {
    setSelectedSemester(value);
    setSelectedCourse("");
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Filtrar por Disciplina e Semestre
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        {/* Filtro de Semestre */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Semestre
          </Typography>
          <Select
            value={selectedSemester}
            onChange={(e) => handleSemesterChange(e.target.value)}
            sx={{ minWidth: 160 }}
            displayEmpty
          >
            <MenuItem value="">Todos</MenuItem>
            {semesters.map((semester) => (
              <MenuItem key={semester} value={String(semester)}>
                {semester}º Semestre
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Filtro de Disciplina */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Disciplina
          </Typography>
          <Select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            sx={{ minWidth: 300 }}
            displayEmpty
          >
            <MenuItem value="">Todas</MenuItem>
            {courses.map((course) => (
              <MenuItem key={course} value={course}>
                {course}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {/* Contador de resultados */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {filteredBooks.length} livro(s) encontrado(s)
      </Typography>

      {/* Lista de livros filtrados */}
      {filteredBooks.map((book, idx) => (
        <Card key={idx} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">{book.title}</Typography>
            <Typography variant="body2">
              {book.author} - {book.publisher} ({book.year})
            </Typography>
            <Typography variant="body2" color="primary">
              Disciplina: {book.course} | {book.semester}º Semestre
            </Typography>
          </CardContent>
        </Card>
      ))}

      {filteredBooks.length === 0 && (
        <Typography variant="body1" color="text.secondary">
          Nenhum livro encontrado para os filtros selecionados.
        </Typography>
      )}
    </>
  );
}