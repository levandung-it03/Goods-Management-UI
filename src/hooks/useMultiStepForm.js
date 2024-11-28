import { cloneElement, useMemo, useState } from 'react';

export function useMultistepForm(steps, initialData = {}) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [formData, setFormData] = useState(initialData);
    const isFirstStep = useMemo(() => currentStepIndex === 0, [currentStepIndex]);
    const isLastStep = useMemo(() => currentStepIndex === steps.length - 1, [currentStepIndex, steps.length]);

    const next = (stepData) => {
        setFormData((prev) => ({ ...prev, ...stepData }));
        if (!isLastStep) setCurrentStepIndex(currentStepIndex + 1);
    };

    const back = () => {
        if (!isFirstStep) setCurrentStepIndex(currentStepIndex - 1);
    };

    const goTo = (i) => setCurrentStepIndex(i);

    return {
        currentStepIndex,
        currentStep: cloneElement(steps[currentStepIndex], { formData, next, back }),
        isFirstStep: currentStepIndex === 0,
        isLastStep: currentStepIndex === steps.length - 1,
        formData,
        goTo,
        next,
        back,
    };
}
