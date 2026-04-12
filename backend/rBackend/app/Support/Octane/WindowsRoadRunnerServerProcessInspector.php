<?php

namespace App\Support\Octane;

use Laravel\Octane\RoadRunner\ServerProcessInspector;

class WindowsRoadRunnerServerProcessInspector extends ServerProcessInspector
{
    /**
     * Determine if the RoadRunner server process is running.
     */
    public function serverIsRunning(): bool
    {
        $serverState = $this->serverStateFile->read();
        $masterProcessId = (int) ($serverState['masterProcessId'] ?? 0);
        $rpcPort = (int) ($serverState['state']['rpcPort'] ?? 0);

        if ($masterProcessId > 0 && $this->posix->kill($masterProcessId, 0)) {
            return true;
        }

        if ($rpcPort > 0) {
            return $this->findListeningProcessId($rpcPort) !== null;
        }

        return false;
    }

    /**
     * Stop the RoadRunner server.
     */
    public function stopServer(): bool
    {
        $serverState = $this->serverStateFile->read();
        $masterProcessId = (int) ($serverState['masterProcessId'] ?? 0);
        $rpcPort = (int) ($serverState['state']['rpcPort'] ?? 0);
        $host = (string) ($serverState['state']['host'] ?? '127.0.0.1');
        $signal = defined('SIGTERM') ? SIGTERM : 15;
        $rpcProcessId = $rpcPort > 0 ? (int) ($this->findListeningProcessId($rpcPort) ?? 0) : 0;

        if ($rpcPort > 0) {
            $stopCommand = $this->processFactory->createProcess([
                $this->findRoadRunnerBinary(),
                'stop',
                '-o', 'version=3',
                '-o', "rpc.listen=tcp://{$host}:{$rpcPort}",
                '-s',
            ], base_path());

            $stopCommand->run();

            if ($this->findListeningProcessId($rpcPort) === null) {
                return true;
            }
        }

        if ($masterProcessId > 0 && $this->posix->kill($masterProcessId, $signal)) {
            if ($rpcPort === 0 || $this->findListeningProcessId($rpcPort) === null) {
                return true;
            }
        }

        if ($rpcProcessId > 0) {
            return (bool) $this->posix->kill($rpcProcessId, $signal);
        }

        return false;
    }

    protected function findListeningProcessId(int $port): ?int
    {
        $output = [];
        $exitCode = 1;

        @exec(sprintf('netstat -ano -p tcp | findstr ":%d " 2>NUL', $port), $output, $exitCode);

        if ($exitCode !== 0 || empty($output)) {
            return null;
        }

        foreach ($output as $line) {
            $pattern = '/^\s*TCP\s+\S+:' . preg_quote((string) $port, '/') . '\s+\S+\s+LISTENING\s+(\d+)/i';

            if (preg_match($pattern, $line, $matches) === 1) {
                return (int) $matches[1];
            }
        }

        return null;
    }
}
