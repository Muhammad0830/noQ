export interface InfoFormState {
    name: string;
    phoneNumber: string;
};

export interface AddBusinessStepOneForm {
    name: string;
    categoryId: string;
    description?: string | null;
    address: string;
    phone: string;
}