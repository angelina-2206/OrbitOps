import { useState } from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';

// Web Serial API types declaration for TypeScript
interface SerialPort {
  open(options: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
  readable: ReadableStream<Uint8Array>;
  writable: WritableStream<Uint8Array>;
}

export function useWebSerial() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedPort, setConnectedPort] = useState<SerialPort | null>(null);
  const { setConnectionMode, addLog } = useTelemetryStore();

  const connectSerial = async (baudRate = 115200) => {
    if (!('serial' in navigator)) {
      addLog('ERROR', 'Web Serial API is not supported in this browser. Use Chrome/Edge/Opera.');
      return false;
    }

    try {
      setIsConnecting(true);
      const navSerial = (navigator as unknown as { serial: { requestPort(): Promise<SerialPort> } }).serial;
      const port = await navSerial.requestPort();
      await port.open({ baudRate });
      
      setConnectedPort(port);
      setConnectionMode('SERIAL');
      addLog('SUCCESS', `Web Serial port connected at ${baudRate} baud.`);
      setIsConnecting(false);
      return true;
    } catch (err) {
      addLog('ERROR', `Web Serial connection failed: ${err instanceof Error ? err.message : String(err)}`);
      setIsConnecting(false);
      return false;
    }
  };

  const disconnectSerial = async () => {
    if (connectedPort) {
      try {
        await connectedPort.close();
        setConnectedPort(null);
        setConnectionMode('SIMULATOR');
        addLog('INFO', 'Web Serial port disconnected. Switched back to Simulator.');
      } catch (err) {
        addLog('ERROR', `Error closing serial port: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  };

  return {
    isConnecting,
    isConnected: !!connectedPort,
    connectSerial,
    disconnectSerial,
  };
}
