import { Resend } from "resend";
import { resendApiKey } from "../../config";


export class ResendMailService {
    constructor(private resend: Resend = new Resend(resendApiKey)) {}

    async sendEmail(to: string, subject: string, html: string) {
        const response = await this.resend.emails.send({
            from: 'Mercor <onboarding@resend.dev>',
            to: to,
            subject: subject,
            html: html
        });
        return response;
    }
}