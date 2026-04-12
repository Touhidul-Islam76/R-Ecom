<?php

namespace App\helpers;

trait ApiResponseTrait
{
    protected function success($data = null, $message = 'Success', $status = 200)
    {
        return $this->successResponse($data, $message, $status);
    }

    protected function successResponse($data = null, $message = 'Success', $status = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    protected function error($errors = null, $status = 400, $message = 'Error')
    {
        return $this->errorResponse($message, $status, $errors);
    }

    protected function errorResponse($message = 'Error', $status = 400, $errors = null)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }
}
