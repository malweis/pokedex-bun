import { useState, useEffect } from 'react';

function useFibonacci(n: number) {
  const [sequence, setSequence] = useState<number[]>([]);

  useEffect(() => {
    let fibSequence = [0, 1];
    while (fibSequence.length < n) {
      let length = fibSequence.length;
      fibSequence.push(fibSequence[length - 1] + fibSequence[length - 2]);
    }
    setSequence(fibSequence.slice(0, n));
  }, [n]);

  return sequence;
}

export default useFibonacci;