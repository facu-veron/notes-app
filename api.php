<?php

header('Content-Type: application/json');

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getNotes($pdo);
        break;
    case 'POST':
        createNote($pdo);
        break;
    case 'PUT':
        updateNote($pdo);
        break;
    case 'DELETE':
        deleteNote($pdo);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}

function getNotes($pdo) {
    $stmt = $pdo->query('SELECT * FROM notes ORDER BY updated_at DESC');
    $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($notes);
}

function createNote($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    $title = trim($data['title'] ?? '');
    $content = trim($data['content'] ?? '');

    if ($title === '' || $content === '') {
        http_response_code(400);
        echo json_encode(['error' => 'El título y el contenido son obligatorios']);
        return;
    }

    $stmt = $pdo->prepare('INSERT INTO notes (title, content) VALUES (?, ?)');
    $stmt->execute([$title, $content]);

    echo json_encode(['id' => $pdo->lastInsertId()]);
}

function updateNote($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;
    $title = trim($data['title'] ?? '');
    $content = trim($data['content'] ?? '');

    if (!$id || $title === '' || $content === '') {
        http_response_code(400);
        echo json_encode(['error' => 'El id, título y contenido son obligatorios']);
        return;
    }

    $stmt = $pdo->prepare('UPDATE notes SET title = ?, content = ? WHERE id = ?');
    $stmt->execute([$title, $content, $id]);

    echo json_encode(['success' => true]);
}

function deleteNote($pdo) {
    $id = $_GET['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'El id es obligatorio']);
        return;
    }

    $stmt = $pdo->prepare('DELETE FROM notes WHERE id = ?');
    $stmt->execute([$id]);

    echo json_encode(['success' => true]);
}
