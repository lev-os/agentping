/**
 * Port Finder
 *
 * Intelligent port selection with conflict detection
 */

import { createServer } from 'net';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class PortFinder {
  /**
   * Find an available port
   *
   * Strategy:
   * 1. Try preferred port
   * 2. Try ports in port_range
   * 3. Find any available port in [6000-9000]
   */
  async findAvailablePort(
    preferredPort: number,
    portRange: number[],
    excludePorts: number[] = []
  ): Promise<number> {
    // Get currently occupied ports
    const occupiedPorts = await this.getOccupiedPorts();
    const allExcluded = [...excludePorts, ...occupiedPorts];

    // Try preferred port
    if (!allExcluded.includes(preferredPort) && await this.isPortAvailable(preferredPort)) {
      console.log(`[PortFinder] Using preferred port: ${preferredPort}`);
      return preferredPort;
    }

    console.log(`[PortFinder] Preferred port ${preferredPort} not available, trying range...`);

    // Try range
    for (const port of portRange) {
      if (!allExcluded.includes(port) && await this.isPortAvailable(port)) {
        console.log(`[PortFinder] Using port from range: ${port}`);
        return port;
      }
    }

    console.log(`[PortFinder] All ports in range occupied, finding any available port...`);

    // Find any available port
    for (let port = 6000; port < 9000; port++) {
      if (!allExcluded.includes(port) && await this.isPortAvailable(port)) {
        console.log(`[PortFinder] Found available port: ${port}`);
        return port;
      }
    }

    throw new Error('No available ports found in range [6000-9000]');
  }

  /**
   * Check if a port is available
   */
  async isPortAvailable(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const server = createServer();

      server.once('error', () => {
        resolve(false);
      });

      server.once('listening', () => {
        server.close();
        resolve(true);
      });

      server.listen(port);
    });
  }

  /**
   * Get all occupied ports using lsof
   */
  async getOccupiedPorts(): Promise<number[]> {
    try {
      const { stdout } = await execAsync('lsof -i -P -n | grep LISTEN');
      const ports = stdout
        .split('\n')
        .map(line => {
          const match = line.match(/:(\d+)\s+\(LISTEN\)/);
          return match ? parseInt(match[1]) : null;
        })
        .filter((port): port is number => port !== null);

      return [...new Set(ports)];
    } catch {
      // lsof command failed or no listening ports
      return [];
    }
  }
}
