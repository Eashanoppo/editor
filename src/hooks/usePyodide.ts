"use client";

import { useCallback, useEffect, useState } from "react";
import {
  pyodideRunner,
  type PyodideRuntimeState,
  type PythonExecutionResult,
} from "@/lib/pyodide/runner";

export function usePyodide(options?: { preloadOnMount?: boolean }) {
  const [runtimeState, setRuntimeState] = useState<PyodideRuntimeState>(
    () => pyodideRunner.getState().state
  );
  const [runtimeError, setRuntimeError] = useState<string | undefined>(
    () => pyodideRunner.getState().error
  );

  useEffect(() => {
    const unsubscribe = pyodideRunner.subscribe((nextState, errMsg) => {
      setRuntimeState(nextState);
      setRuntimeError(errMsg);
    });

    if (options?.preloadOnMount) {
      pyodideRunner.preload();
    }

    return unsubscribe;
  }, [options?.preloadOnMount]);

  const runCode = useCallback(
    async (code: string, timeoutMs = 5000): Promise<PythonExecutionResult> => {
      return pyodideRunner.run(code, timeoutMs);
    },
    []
  );

  const cancelRun = useCallback(() => {
    pyodideRunner.cancel();
  }, []);

  const preload = useCallback(() => {
    pyodideRunner.preload();
  }, []);

  return {
    runtimeState,
    runtimeError,
    runCode,
    cancelRun,
    preload,
  };
}

