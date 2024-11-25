import { forwardRef, memo, useCallback } from 'react';
import './FormRHF.scss';
import { FormProvider, useForm } from 'react-hook-form';

function FormRHF({ children, className = '', defaultValues, mode, onSubmit, confirm, methods, ...props }, ref) {
    const internalMethods = useForm({
        defaultValues: defaultValues || {}, // Default values for all fields
        mode: mode || 'all', // Validate on change, blur and submit
    });

    const formMethods = methods || internalMethods;

    const handleSubmit = useCallback(
        async (data) => {
            const isChanged = JSON.stringify(data) !== JSON.stringify(defaultValues);

            // If don't need confirmation then just submit it
            if (!confirm) {
                await onSubmit(data);
                return;
            }
            // If need confirmation, check if there are any changes. If yes, submit data else reset the data
            if (isChanged) {
                if (window.confirm('Are you sure you want to submit?')) {
                    await onSubmit(data);
                } else {
                    await onSubmit(); // onSubmit with no argument to run remain code
                    formMethods.reset(defaultValues);
                }
            } else await onSubmit(); // onSubmit with no argument to run remain code
        },
        [confirm, defaultValues, formMethods, onSubmit],
    );

    return (
        <FormProvider {...formMethods}>
            <form ref={ref} className={className} onSubmit={formMethods.handleSubmit(handleSubmit)} {...props}>
                {children}
            </form>
        </FormProvider>
    );
}

export default memo(forwardRef(FormRHF));

// const DialogContentForIcon = ({ setInputValue }) => {
//     return (
//         <ul>
//             <li onClick={() => setInputValue('email1@gmail.com')}>Email 1</li>
//             <li onClick={() => setInputValue('email2@gmail.com')}>Email 2</li>
//             <li onClick={() => setInputValue('email3@gmail.com')}>Email 3</li>
//         </ul>
//     );
// };

// export function FormCompoExample() {
//     // Form Component
//     const genderOptions = [
//         { value: 0, text: 'Female' },
//         { value: 1, text: 'Male' },
//     ];
//     const skillOptions = [
//         { value: 1, text: 'JavaScript' },
//         { value: 2, text: 'Python' },
//         { value: 3, text: 'Java' },
//         { value: 4, text: 'Dev ops' },
//     ];
//     const [dialogContent, setDialogContent] = useState();
//     /* Truyền methods cho Form nếu component cần tùy chỉnh value
//        còn không thì thôi vì Form tự quản lý data của chính nó (vd bên LoginPage)
//     const methods = useForm({ defaultValues: { email: '123' }, mode: 'all' });

//     const onSubmit = useCallback(async (data) => {
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//         console.log(data);
//     }, []);

//     return (
//         <Form className="form-example" onSubmit={onSubmit} methods={methods}>
//             <InputField
//                 name="email"
//                 label="Email"
//                 validators={{
//                     required: (v) => (checkIsBlank(v) ? 'Email is required' : null),
//                     email: (v) => (!checkIsEmail(v) ? 'Invalid email' : null),
//                 }}
//                 formatters={{
//                     onChange: [capitalizeWords],
//                 }}
//                 icon={
//                     <Book
//                         onClick={() =>
//                             setDialogContent(<DialogContentForIcon setInputValue={(value) => methods.setValue('email', value)} />)
//                         }
//                     />
//                 }
//             />
//             <InputField
//                 type="checkbox"
//                 name="status1"
//                 id="status1"
//                 label="Active"
//                 uncheckedlabel="Unactive"
//             />
//             <MultiSelectField label="Skills" name="skills" options={skillOptions} />
//             <SelectField label="Gender" name="gender" options={genderOptions} />
//             <button disabled={methods.formState.isSubmitting}>{methods.formState.isSubmitting ? 'Loading' : 'Submit'}</button>
//             <Dialog dialogContent={dialogContent} setDialogContent={setDialogContent} />
//         </Form>
//     );
// }
