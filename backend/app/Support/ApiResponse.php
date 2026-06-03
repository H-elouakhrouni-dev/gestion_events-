<?php

namespace App\Support;

use Exception;
use Illuminate\Http\JsonResponse;

class ApiResponse
{
    public static function error(string $message, int $status = 400, ?Exception $e = null): JsonResponse
    {
        if ($e && config('app.debug')) {
            return response()->json([
                'message' => $message,
                'error' => $e->getMessage(),
            ], $status);
        }

        return response()->json(['message' => $message], $status);
    }

    public static function dbError(string $message, Exception $e): JsonResponse
    {
        $friendly = $message;

        if (str_contains($e->getMessage(), '45000')) {
            $friendly = trim(preg_replace('/^SQLSTATE\[45000\]:[^:]*:\s*/', '', $e->getMessage()) ?? $message);
        }

        if (config('app.debug')) {
            return response()->json([
                'message' => $friendly,
                'error' => $e->getMessage(),
            ], 400);
        }

        return response()->json(['message' => $friendly], 400);
    }
}
