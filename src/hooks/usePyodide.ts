"use client";

import { useCallback, useEffect, useState } from "react";
import {
  pyodideRunner,
  type InteractiveExecutionState,
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
  const [interactive, setInteractive] = useState<InteractiveExecutionState>(
    () => pyodideRunner.getInteractiveState()
  );

  useEffect(() => {
    const unsubscribeStatus = pyodideRunner.subscribe((nextState, errMsg) => {
      setRuntimeState(nextState);
      setRuntimeError(errMsg);
    });
    const unsubscribeInteractive = pyodideRunner.subscribeInteractive(
      (nextInteractive) => {
        setInteractive(nextInteractive);
      }
    );

    if (options?.preloadOnMount) {
      pyodideRunner.preload();
    }

    return () => {
      unsubscribeStatus();
      unsubscribeInteractive();
    };
  }, [options?.preloadOnMount]);

  const runCode = useCallback(
    async (code: string, timeoutMs = 5000): Promise<PythonExecutionResult> => {
      return pyodideRunner.run(code, timeoutMs);
    },
    []
  );

  const submitInput = useCallback((value: string, eof = false) => {
    pyodideRunner.submitInput(value, eof);
  }, []);

  const cancelRun = useCallback(() => {
    pyodideRunner.cancel();
  }, []);

  const preload = useCallback(() => {
    pyodideRunner.preload();
  }, []);

  return {
    runtimeState,
    runtimeError,
    streamingStdout: interactive.streamingStdout,
    pendingInput: interactive.pendingInput,
    runCode,
    submitInput,
    cancelRun,
    preload,
  };
}

