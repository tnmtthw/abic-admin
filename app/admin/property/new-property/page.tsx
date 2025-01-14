'use client';

import { Card, Input, Button, Select, SelectItem, Checkbox } from '@nextui-org/react';
import { Formik, Field, Form, ErrorMessage, } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { select } from '@nextui-org/theme';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Enter a valid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    property: Yup.string().required('Property type is required'),
    type: Yup.string().required('Type is required'),
    location: Yup.string().required('Location is required'),
    price: Yup.number().positive('Price must be positive').required('Price is required'),
    area: Yup.number().positive('Area must be positive').required('Area is required'),
    parking: Yup.boolean()
        .oneOf([true], 'You must select a parking option')
        .required('Parking option is required'),
    vacant: Yup.boolean().required('Vacancy status is required'),
    nearby: Yup.string().required('Nearby places are required'),
    description: Yup.string().required('Description is required'),
    sale: Yup.string().required('Sale type is required'),
    badge: Yup.string().required('Badge is required'),
    status: Yup.string().required('Status is required'),
    submit_status: Yup.string().required('Submit status is required'),
    unit_number: Yup.number()
        .positive('Unit number must be positive')
        .required('Unit number is required'),
    unit_type: Yup.string().required('Unit type is required'),
    unit_furnish: Yup.string().required('Unit furnishing status is required'),
    unit_floor: Yup.string().required('Unit floor is required'),
    submitted_by: Yup.string().required('Submitted by is required'),
    commission: Yup.boolean().required('Commission is required'),
    terms: Yup.string().required('Terms are required'),
    title: Yup.string().required('Title is required'),
    lease: Yup.string().required('Lease information is required'),
    amenities: Yup.array()
        .min(1, 'At least one amenity is required')
        .required('Amenities are required'),
});

const PropertyForm = () => {
    const userId = sessionStorage.getItem('id');
    const token = sessionStorage.getItem('token');

    const handleSubmit = async (
        values: any,
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        console.log("Form values before submit:", values);

        const payload = {
            ...values,
            parking: values.parking ? 1 : 0,
            vacant: values.vacant ? 1 : 0,
            commission: values.commission ? 1 : 0,
        };

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 201) {
                console.log("Form submitted successfully:", response.data);
            } else {
                console.error("Form submission failed:", response.statusText);
            }
        } catch (error) {
            console.error("An error occurred during form submission:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h2 className="text-center text-2xl font-bold mb-6">Submit Property</h2>
            <Card aria-labelledby="submit-property-form" className="mx-auto p-6">
                <Formik
                    initialValues={{
                        user_id: userId,
                        status: "Pending",
                        submit_status: "Pending",
                        name: '',
                        email: '',
                        phone: '',
                        property: '',
                        type: '',
                        location: '',
                        price: '',
                        area: '',
                        parking: false, // Set to false for checkbox
                        vacant: false, // Set to false for checkbox
                        nearby: '',
                        description: '',
                        sale: '',
                        badge: '',
                        unit_number: '',
                        unit_type: '',
                        unit_furnish: '',
                        unit_floor: '',
                        submitted_by: '',
                        commission: false,
                        terms: '',
                        title: '',
                        lease: '',
                        turnover: '',
                        amenities: [],
                        images: [],
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form id="modalForm" className="space-y-6">
                            {/* Personal Information */}
                            <h4 className="mb-3">Personal Information:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="col-span-1 mb-2">
                                    <Field
                                        name="name"
                                        as={Input}
                                        label="Full Name"
                                        variant="underlined"
                                        placeholder="Enter full name"
                                    />
                                    <ErrorMessage name="name" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>
                                <div className="col-span-1 mb-2">
                                    <Field
                                        name="email"
                                        as={Input}
                                        label="Email"
                                        variant="underlined"
                                        placeholder="Enter your email"
                                    />
                                    <ErrorMessage name="email" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>
                                <div className="col-span-1 mb-2">
                                    <Field
                                        name="phone"
                                        as={Input}
                                        label="Phone Number"
                                        variant="underlined"
                                        placeholder="Enter phone number"
                                    />
                                    <ErrorMessage name="phone" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>
                                <div className="col-span-1 mb-2">
                                    <Field
                                        as={Select}
                                        name="submitted_by"
                                        id="submitted_by"
                                        label="Are you the owner or an agent?"
                                        variant="underlined"
                                        placeholder="Select"
                                    >
                                        <SelectItem value="owner">Owner</SelectItem>
                                        <SelectItem value="agent">Agent</SelectItem>
                                    </Field>
                                    <ErrorMessage
                                        name="submitted_by"
                                        component="div"
                                        className="text-xs text-[#F31260] mt-1"
                                    />
                                </div>
                            </div>



                            {/* Property Details */}
                            <h4 className="mb-3 pt-4">Property Details:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {/* Property Name */}
                                <div className="col-span-1">
                                    <Field
                                        name="property"
                                        as={Input}
                                        label="Property Name"
                                        variant="underlined"
                                        placeholder="Enter property name"
                                    />
                                    <ErrorMessage name="property" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>

                                {/* Location */}
                                <div className="col-span-1">
                                    <Field
                                        name="location"
                                        as={Input}
                                        label="Location"
                                        variant="underlined"
                                        placeholder="Enter location"
                                    />
                                    <ErrorMessage name="location" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>

                                {/* Property Type */}
                                <div className="col-span-1">
                                    <Field
                                        as={Select}
                                        label="Property Type"
                                        name="type"
                                        id="type"
                                        variant="underlined"
                                        placeholder="Select Property Type"
                                    >
                                        <SelectItem key="sale" >For Sale</SelectItem>
                                        <SelectItem key="rent" >For Rent</SelectItem>
                                    </Field>
                                    <ErrorMessage name="type" component="div" className="text-xs text-[#F31260] mt-1" />
                                </div>

                                {/* Unit Type */}
                                <div className="col-span-1">
                                    <label htmlFor="unit_type" className="block text-sm font-medium text-gray-700">
                                        Unit Type
                                    </label>
                                    <Field
                                        as={Select}
                                        name="unit_type"
                                        id="unit_type"
                                        variant="underlined"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="Select Unit Type"
                                    >
                                        <SelectItem key="Studio">Studio</SelectItem>
                                        <SelectItem key="1BR">1BR</SelectItem>
                                        <SelectItem key="2BR">2BR</SelectItem>
                                        <SelectItem key="3BR">3BR</SelectItem>
                                        <SelectItem key="Loft">Loft</SelectItem>
                                        <SelectItem key="Penthouse">Penthouse</SelectItem>
                                        <SelectItem key="Duplex/Bi-Level">Duplex/Bi-Level</SelectItem>
                                    </Field>
                                    <ErrorMessage name="unit_type" component="div" className="text-xs text-red-500 mt-1" />
                                </div>

                                {/* Price */}
                                <div className="col-span-1">
                                    <Field
                                        name="price"
                                        as={Input}
                                        type="number"
                                        label="Price"
                                        variant="underlined"
                                        placeholder="Enter price"
                                    />
                                    <ErrorMessage name="price" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>

                                {/* Square Meter */}
                                <div className="col-span-1">
                                    <Field
                                        name="area"
                                        as={Input}
                                        type="number"
                                        label="Square Meter"
                                        variant="underlined"
                                        placeholder="Enter square meter"
                                    />
                                    <ErrorMessage name="area" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>

                                {/* Floor Number */}
                                <div className="col-span-1">
                                    <Field
                                        name="unit_floor"
                                        as={Input}
                                        type="number"
                                        label="Floor Number"
                                        variant="underlined"
                                        placeholder="Enter floor number"
                                    />
                                    <ErrorMessage name="unit_floor" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>

                                {/* Unit Number */}
                                <div className="col-span-1">
                                    <Field
                                        name="unit_number"
                                        as={Input}
                                        label="Unit Number"
                                        variant="underlined"
                                        placeholder="Enter unit number"
                                    />
                                    <ErrorMessage name="unit_number" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>

                                {/* Commission */}
                                <div className="col-span-1">
                                    <label className="flex items-center space-x-2">
                                        <Field
                                            type="checkbox"
                                            name="commission"
                                            className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span>Commission</span>
                                    </label>
                                    <ErrorMessage name="commission" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>

                                {/* Vacant */}
                                <div className="col-span-1">
                                    <label className="flex items-center space-x-2">
                                        <Field
                                            type="checkbox"
                                            name="vacant"
                                            className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span>Vacant</span>
                                    </label>
                                    <ErrorMessage name="vacant" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>

                                {/* Nearby */}
                                <div className="col-span-1">
                                    <Field
                                        name="nearby"
                                        as={Input}
                                        label="Nearby"
                                        variant="underlined"
                                        placeholder="Enter nearby details"
                                    />
                                    <ErrorMessage name="nearby" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>

                                {/* Sale Type */}
                                <div className="col-span-1">
                                    <Field
                                        as={Select}
                                        name="sale"
                                        id="sale"
                                        label="Sale Type"
                                        variant="underlined"
                                        placeholder="Select sale type"
                                    >
                                        <SelectItem key="rfo">RFO</SelectItem>
                                        <SelectItem key="pre-selling">Pre-Selling</SelectItem>
                                    </Field>
                                    <ErrorMessage name="sale" component="div" className="text-xs text-[#F31260] mt-1" />
                                </div>

                                {/* Turnover Date (For Pre-Selling) */}
                                <div className="col-span-1">
                                    <Field
                                        name="turnover"
                                        as={Input}
                                        type="date"
                                        label="Turnover Date"
                                        variant="underlined"
                                        placeholder="Enter turnover date"
                                    />
                                    <ErrorMessage name="turnover" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>

                                {/* Payment Terms */}
                                <div className="col-span-1">
                                    <Field
                                        name="terms"
                                        as={Input}
                                        label="Payment Terms"
                                        variant="underlined"
                                        placeholder="Enter payment terms"
                                    />
                                    <ErrorMessage name="terms" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>
                                <div className="col-span-1">
                                    <Field
                                        name="badge"
                                        as={Input}
                                        label="Badge"
                                        variant="underlined"
                                        placeholder="Enter badge"
                                    />
                                    <ErrorMessage name="terms" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>
                                <div className="col-span-1">
                                    <Field
                                        name="description"
                                        as={Input}
                                        label="Description"
                                        variant="underlined"
                                        placeholder="Enter badge"
                                    />
                                    <ErrorMessage name="terms" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>

                                {/* Title */}
                                <div className="col-span-1">
                                    <Field
                                        name="title"
                                        as={Input}
                                        label="Title"
                                        variant="underlined"
                                        placeholder="Enter title"
                                    />
                                    <ErrorMessage name="title" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>

                                {/* Lease Term */}
                                <div className="col-span-1">
                                    <Field
                                        as={Select}
                                        name="lease"
                                        id="lease"
                                        label="Minimum Lease Term"
                                        variant="underlined"
                                        placeholder="Select min lease term"
                                    >
                                        <SelectItem key="six-months">6 months</SelectItem>
                                        <SelectItem key="one-year">1 year</SelectItem>
                                        <SelectItem key="two-years">2 years</SelectItem>
                                    </Field>
                                    <ErrorMessage name="lease" component="div" className="text-xs text-[#F31260] mt-1" />
                                </div>

                                {/* Furnish */}
                                <div className="col-span-1">
                                    <Field
                                        as={Select}
                                        name="unit_furnish"
                                        id="furnish"
                                        label="Furnish Type"
                                        variant="underlined"
                                        placeholder="Select Furnish Type"
                                    >
                                        <SelectItem key="furnished">Furnished</SelectItem>
                                        <SelectItem key="unfurnished">Unfurnished</SelectItem>
                                    </Field>
                                    <ErrorMessage name="furnish" component="div" className="text-xs text-[#F31260] mt-1" />
                                </div>

                                {/* Parking */}
                                <div>
                                    <label className="flex items-center space-x-2 col-span-1">
                                        <Field
                                            type="checkbox"
                                            name="parking"
                                            className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                                        // onChange={(e) => {
                                        //     console.log(e.target.value)
                                        // }}
                                        />
                                        <span>With Parking</span>
                                    </label>
                                    <ErrorMessage name="parking" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>

                            </div>
                            <div>
                                <h4 className="mt-8">Upload Images:</h4>
                                <Input
                                    type="file"
                                    name="images"
                                    variant="underlined"
                                    multiple
                                    onChange={(event) => setFieldValue('images', event.target.files)}
                                />
                                <ErrorMessage name="images" component="div" className="absolute text-xs text-[#F31260] mt-1" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
                                {/* First Column */}
                                <div className="flex flex-col  space-y-2">
                                    {[
                                        "Pool Area",
                                        "Clubhouse",
                                        "Gym/Fitness Center",
                                        "Balcony/Terrace"
                                    ].map((amenity) => (
                                        <label key={amenity} className="flex  space-x-2">
                                            <Field
                                                type="checkbox"
                                                name="amenities"
                                                value={amenity}
                                                className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span>{amenity}</span>
                                        </label>
                                    ))}
                                </div>

                                {/* Second Column */}
                                <div className="flex flex-col  space-y-2">
                                    {[
                                        "Concierge Services",
                                        "Security",
                                        "Elevator",
                                        "Underground Parking"
                                    ].map((amenity) => (
                                        <label key={amenity} className="flex  space-x-2">
                                            <Field
                                                type="checkbox"
                                                name="amenities"
                                                value={amenity}
                                                className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span>{amenity}</span>
                                        </label>
                                    ))}
                                </div>

                                {/* Third Column */}
                                <div className="flex flex-col  space-y-2">
                                    {[
                                        "Pet-Friendly Facilities",
                                        "Guest Suites"
                                    ].map((amenity) => (
                                        <label key={amenity} className="flex  space-x-2">
                                            <Field
                                                type="checkbox"
                                                name="amenities"
                                                value={amenity}
                                                className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span>{amenity}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-center">
                                <Button
                                    type="submit"
                                    color="primary"
                                    className="w-full"
                                    isLoading={isSubmitting}
                                    isDisabled={isSubmitting}
                                >
                                    Submit
                                </Button>
                            </div>
                        </Form>

                    )}
                </Formik>
            </Card>

        </div>
    );
};

export default PropertyForm;