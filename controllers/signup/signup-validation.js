import { z } from 'zod';
const userSchema = z
    .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    name: z.string(),
    title: z.string(),
    gender: z.enum(['male', 'female']),
    phoneNumber: z.string(),
    dateOfBirth: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
        .transform((val) => new Date(val)),
    nationality: z.string(),
    region: z.string(),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
const patientSchema = z.object({
    height: z.string().regex(/^\d+$/, 'Only numbers are allowed'),
    weight: z.string().regex(/^\d+$/, 'Only numbers are allowed'),
    allergies: z.string(),
    lifestyle: z.string(),
    idVerification: z.string().optional(),
    emergencyContact: z.object({
        name: z.string(),
        relation: z.string(),
        phoneNumber: z.string(),
    }),
});
const patientMedicalHistorySchema = z.object({
    diseaseId: z.string(),
    medicalHistory: z.string(),
    familyHistory: z.string(),
    medicinalHistory: z.string(),
    currentExperiencedSymptoms: z.string(),
});
const doctorSchema = z.object({
    specialization: z.string(),
    institute: z.string(),
    pointOfContact: z.string(),
    license: z.string(),
});
const trialSchema = z
    .object({
    trialDescription: z.string(),
    trialRequirements: z.string(),
    trialStart: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
        .transform((val) => new Date(val)),
    trialEnd: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
        .transform((val) => new Date(val)),
    riskLevel: z.enum(['low', 'medium', 'high']),
})
    .refine((data) => data.trialStart < data.trialEnd, {
    message: 'Trial start date should be before trial end date',
    path: ['trialEnd'],
})
    .transform((data) => {
    return {
        ...data,
        duration: data.trialEnd.getTime() - data.trialStart.getTime(), // Duration in milliseconds
    };
});
export const requestSchema = z.discriminatedUnion('userType', [
    z.object({
        userType: z.literal('patient'),
        userDetails: userSchema,
        patientDetails: patientSchema,
        medicalHistory: patientMedicalHistorySchema,
    }),
    z.object({
        userType: z.literal('doctor'),
        userDetails: userSchema,
        doctorDetails: doctorSchema,
        trialDetails: trialSchema,
    }),
    z.object({
        userType: z.literal('donorAcquirer'),
        userDetails: userSchema,
        donorAcquirerDetails: z.object({
            role: z.enum(['donor', 'acquirer', 'both']),
        }),
    }),
]);
