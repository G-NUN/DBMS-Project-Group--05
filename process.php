<?php
header('Content-Type: application/json');

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "grade_tracking";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

function calculate_grade($score) {
    if ($score >= 93) return ['A', 4.0];
    if ($score >= 90) return ['A-', 3.7];
    if ($score >= 87) return ['B+', 3.3];
    if ($score >= 83) return ['B', 3.0];
    if ($score >= 80) return ['B-', 2.7];
    if ($score >= 77) return ['C+', 2.3];
    if ($score >= 73) return ['C', 2.0];
    if ($score >= 70) return ['C-', 1.7];
    if ($score >= 67) return ['D+', 1.3];
    if ($score >= 60) return ['D', 1.0];
    return ['F', 0.0];
}

$name = $_POST['name'];
$student_id = $_POST['student_id'];
$course = $_POST['course'];
$attendance = floatval($_POST['attendance']);
$quizzes = $_POST['quizzes'];
$assignments = $_POST['assignments'];
$midterm = floatval($_POST['midterm']);
$final_exam = floatval($_POST['final_exam']);

$quiz_avg = (!empty($quizzes)) ? array_sum($quizzes) / count($quizzes) : 0;
$assignment_avg = (!empty($assignments)) ? array_sum($assignments) / count($assignments) : 0;

$total_score = $attendance + $quiz_avg + $assignment_avg + $midterm + $final_exam;

list($letter, $points) = calculate_grade($total_score);

$sql = "INSERT INTO students (student_id, name, course, attendance, quiz_avg, assignment_avg, midterm, final_exam, total_score, letter_grade, grade_point)
VALUES ('$student_id', '$name', '$course', '$attendance', '$quiz_avg', '$assignment_avg', '$midterm', '$final_exam', '$total_score', '$letter', '$points')";

if ($conn->query($sql) === TRUE) {
    echo json_encode([
        'name' => $name,
        'total_score' => $total_score,
        'letter_grade' => $letter,
        'grade_point' => $points
    ]);
} else {
    echo json_encode(['error' => 'Database insert failed']);
}

$conn->close();
?>
