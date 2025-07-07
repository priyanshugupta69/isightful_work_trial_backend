import nodemailer from 'nodemailer';

export class NodemailerMailService {
    private transporter: nodemailer.Transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'priyanshuraja456@gmail.com',
                pass: 'iwwl fhlq uqul dqmj'
            }
        });
    }

    async sendEmail(to: string, subject: string, html: string) {
        const info = await this.transporter.sendMail({
            from: 'Mercor <priyanshuraja456@gmail.com>',
            to: to,
            subject: subject,
            html: html
        });
        return info;
    }
}


export default NodemailerMailService;