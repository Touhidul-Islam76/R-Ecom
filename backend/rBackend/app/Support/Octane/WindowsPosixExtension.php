<?php

namespace App\Support\Octane;

use Laravel\Octane\PosixExtension;
use Symfony\Component\Process\Process;

class WindowsPosixExtension extends PosixExtension
{
    /**
     * Emulate basic POSIX signaling behavior on Windows.
     */
    public function kill(int $processId, int $signal): bool
    {
        if ($processId <= 0) {
            return false;
        }

        if (function_exists('posix_kill')) {
            return posix_kill($processId, $signal);
        }

        if (PHP_OS_FAMILY !== 'Windows') {
            return false;
        }

        if ($signal === 0) {
            return $this->windowsProcessExists($processId);
        }

        return $this->windowsTerminateProcess($processId);
    }

    protected function windowsProcessExists(int $processId): bool
    {
        $process = new Process([
            'powershell',
            '-NoProfile',
            '-NonInteractive',
            '-Command',
            "if (Get-Process -Id {$processId} -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }",
        ]);

        $process->run();

        return $process->getExitCode() === 0;
    }

    protected function windowsTerminateProcess(int $processId): bool
    {
        $stopProcess = new Process([
            'powershell',
            '-NoProfile',
            '-NonInteractive',
            '-Command',
            "try { Stop-Process -Id {$processId} -Force -ErrorAction Stop; exit 0 } catch { exit 1 }",
        ]);

        $stopProcess->run();

        if ($stopProcess->getExitCode() === 0) {
            return true;
        }

        $taskKill = new Process([
            'taskkill',
            '/PID',
            (string) $processId,
            '/T',
            '/F',
        ]);

        $taskKill->run();

        return $taskKill->getExitCode() === 0;
    }
}
