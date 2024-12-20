import { formatTime } from '@src/utils/formatters';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import './OtpForm.scss';

function OtpForm({ email, otpExpiredTime = 0, back, action }) {
    const otpRefs = useRef([]);
    // const dispatch = useDispatch();
    const [counter, setCounter] = useState(otpExpiredTime);

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otpRefs.current[index].value) {
            otpRefs.current[index - 1] && setTimeout(() => otpRefs.current[index - 1].focus(), 0);
        } else if (e.key === 'ArrowLeft') {
            otpRefs.current[index - 1] && setTimeout(() => otpRefs.current[index - 1].focus(), 0);
        } else if (e.key === 'ArrowRight') {
            otpRefs.current[index + 1] && setTimeout(() => otpRefs.current[index + 1].focus(), 0);
        }
    };

    const handleInput = (e, index) => {
        const char = e.target.value;
        if ((char >= '0' && char <= '9') || (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
            e.target.value = char.toUpperCase();
            otpRefs.current[index + 1] && otpRefs.current[index + 1].focus();
        } else {
            e.target.value = '';
        }
    };

    const handleClick = async (e) => {
        try {
            const otpValues = otpRefs.current.map((ref) => ref.value).join('');
            const response = await action({ email, otpCode: otpValues });
            console.log({ email, otpCode: otpValues }, response);
        } catch (error) {
            e.preventDefault();
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCounter((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="otp-form">
            <div className="title">OTP</div>
            <div className="otp-fields center">
                {Array(4)
                    .fill(0)
                    .map((_, index) => (
                        <input
                            key={index}
                            ref={(e) => (otpRefs.current[index] = e)} // Save ref for each input
                            className="otp-field"
                            maxLength={1}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onInput={(e) => handleInput(e, index)}
                        />
                    ))}
            </div>
            <div className="otp-timer center">{formatTime(counter)}</div>
            <div className="step-button">
                <button className="center" type="button" onClick={back}>
                    <ArrowLeft />
                    <span>Back</span>
                </button>
                <button className="center" type="submit" onClick={handleClick}>
                    Confirm
                </button>
            </div>
        </div>
    );
}

export default OtpForm;
