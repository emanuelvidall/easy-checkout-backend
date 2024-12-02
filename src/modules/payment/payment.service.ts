import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentService {
  private readonly api = axios.create({
    baseURL: process.env.MERCADO_PAGO_BASE_URL,
    headers: {
      Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
    },
  });

  async createPayment(
    name: string,
    cpf: string,
    email: string,
  ): Promise<{ id: string; qrCode: string; qrCodeBase64: string }> {
    try {
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ');

      const paymentData = {
        transaction_amount: 100.0,
        description: 'Product Purchase',
        payment_method_id: 'pix',
        payer: {
          email,
          first_name: firstName,
          last_name: lastName,
          identification: {
            type: 'CPF',
            number: cpf.replace(/\D/g, ''),
          },
          address: {
            zip_code: '12345678',
            street_name: 'Example Street',
            street_number: '123',
            neighborhood: 'Example Neighborhood',
            city: 'São Paulo',
            federal_unit: 'SP',
          },
        },
      };

      const paymentResponse = await this.api.post('/payments', paymentData, {
        headers: {
          'X-Idempotency-Key': uuidv4(),
        },
      });

      const { id, point_of_interaction } = paymentResponse.data;

      return {
        id,
        qrCode: point_of_interaction.transaction_data.qr_code,
        qrCodeBase64: point_of_interaction.transaction_data.qr_code_base64,
      };
    } catch (error) {
      console.error(
        'Error creating payment:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to create payment');
    }
  }
}
