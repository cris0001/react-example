import {ShipmentFormValues, shipmentSchema} from "@/app/rrr/shipment-form/schema";
import {useFieldArray, useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";

export function ShipmentForm() {
    const [submitError, setSubmitError] = useState("")
    const [trackingNumber, setTrackingNumber] = useState()


    const onSubmit = () => {
        console.log('xd')
    }

    const {register, control, handleSubmit, formState: {errors, isSubmitting},} = useForm<ShipmentFormValues>({
        resolver: zodResolver(shipmentSchema),
        defaultValues: {
            senderName: '',
            email: '',
            deliveryType: 'standard',
            packages: [{weight: '', description: ''}],
            insured: false,
        },
        mode: 'onTouched'
    })


    console.log(errors)
    const {fields, append, remove} = useFieldArray({
        control,
        name: "packages",
    })

    const deliveryType = useWatch({control, name: "deliveryType"})
    const insured = useWatch({control, name: "insured"})
    const packages = useWatch({control, name: 'packages'})

    const inputClass = "w-full border border-gray-300 p-2 rounded text-base"

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}
                  className={"flex flex-col gap-6 w-full max-w-2xl px-4 sm:px-0"} noValidate
            >
                <div className="flex flex-col gap-1">
                    <label htmlFor="senderName">Sender name</label>
                    <input
                        id="senderName"
                        type="text"
                        {...register("senderName")}
                        aria-invalid={!!errors.senderName}
                        className={inputClass}
                    />
                    {errors.senderName && (
                        <span role="alert" className="text-sm text-red-600">
                            {errors.senderName.message}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="email">emial</label>
                    <input
                        id="email"
                        type="email"
                        {...register("email")}
                        aria-invalid={!!errors.email}
                        className={inputClass}
                    />
                    {errors.email && (
                        <span role="alert" className="text-sm text-red-600">
                            {errors.email.message}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="deliveryType">Delivery Type</label>
                    <select

                        id="deliveryType"
                        {...register("deliveryType")}
                        aria-invalid={!!errors.deliveryType}
                        className={inputClass}
                    >
                        <option value="standard">Standardowa</option>
                        <option value="express">Ekspresowa</option>
                        <option value="cod">Za pobraniem</option>

                    </select>
                    {errors.deliveryType && (
                        <span role="alert" className="text-sm text-red-600">
                            {errors.deliveryType.message}
                        </span>
                    )}
                </div>

                {deliveryType === 'cod' && <>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="codAmount">cod amount</label>
                        <input
                            id="codAmount"
                            type="text"
                            {...register("codAmount")}
                            aria-invalid={!!errors.codAmount}
                            className={inputClass}
                        />
                        {errors.codAmount && (
                            <span role="alert" className="text-sm text-red-600">
                            {errors.codAmount.message}
                        </span>
                        )}
                    </div>
                </>}

                <div className="flex flex-col gap-1">
                    <label htmlFor="insured">insured
                        <input
                            id="insured"
                            type="checkbox"
                            {...register("insured")}
                            aria-invalid={!!errors.insured}
                            className={'flex items-center gap-2'}
                        />
                    </label>
                    {errors.insured && (
                        <span role="alert" className="text-sm text-red-600">
                            {errors.insured.message}
                        </span>
                    )}
                </div>

                {insured && <>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="declaredValue">declared value</label>
                        <input
                            id="declaredValue"
                            type="text"
                            {...register("declaredValue")}
                            aria-invalid={!!errors.declaredValue}
                            className={inputClass}
                        />
                        {errors.declaredValue && (
                            <span role="alert" className="text-sm text-red-600">
                            {errors.declaredValue.message}
                        </span>
                        )}
                    </div>
                </>}

                <fieldset className={'border border-gray-200 p-3 sm:p-4 rounded'}>
                    <legend className="px-2">pckgs</legend>

                    <div className="flex flex-col gap-4">
                        {fields.map((field, index) => (
                            <div key={field.id}
                                 className="flex flex-col sm:flex-row gap-2 sm:items-start border border-gray-100 sm:border-0 rounded p-3 sm:p-0"

                            >
                                <div>
                                    <label htmlFor={`packages.${index}.description`} className="text-sm">
                                        Opis
                                    </label>
                                    <input
                                        id={`packages.${index}.description`}
                                        {...register(`packages.${index}.description`)}
                                        aria-invalid={!!errors.packages?.[index]?.description}
                                        className={inputClass}
                                    />
                                    {errors.packages?.[index]?.description && (
                                        <span role="alert" className="text-sm text-red-600">
                                            {errors.packages[index]?.description?.message}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor={`packages.${index}.weight`}>wieght</label>
                                    <input id={`packages.${index}.weight`}
                                           {...register(`packages.${index}.weight`)}
                                           aria-invalid={!!errors.packages?.[index]?.weight}
                                           className={inputClass}

                                    />
                                    {errors.packages?.[index]?.weight && (
                                        <span role="alert" className="text-sm text-red-600">
                                            {errors.packages[index]?.weight?.message}
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    disabled={fields.length === 1}
                                    aria-label={`Usuń pozycję ${index + 1}`}
                                    className="w-full sm:w-auto min-h-11 sm:mt-6 border border-gray-400 px-3 py-2 rounded disabled:text-gray-300 disabled:border-gray-200"
                                >
                                    Usuń
                                </button>


                            </div>

                        ))}
                    </div>
                    {errors.packages?.root?.message && (
                        <span role="alert" className="text-sm text-red-600">
                                      {errors.packages.root.message}
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={() => append({description: "", weight: ''})}
                        className="mt-4 w-full sm:w-auto min-h-11 border border-gray-400 px-3 py-2 rounded"
                    >
                        Dodaj pozycję
                    </button>
                </fieldset>


                <button type={'submit'}>send</button>
            </form>
        </>
    )
}