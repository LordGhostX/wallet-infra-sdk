import { HttpClient } from '@utils/http-client';
import {
  ITransactionSigned,
  TransactionSchema,
  TransactionTypeKeys,
} from '@models/transaction.models';
import { AxiosResponse } from 'axios';
import { TransactionApi } from '@api/transaction.api';

jest.mock('@utils/http-client');
jest.mock('@utils/logger', () => ({
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
}));

describe('TransactionApi', () => {
  let transaction: TransactionApi;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClientMock = new HttpClient('') as jest.Mocked<HttpClient>;
    transaction = new TransactionApi(httpClientMock);
  });

  describe('createSignedTransaction', () => {
    it('should create a signed transaction', async () => {
      const transactionData: ITransactionSigned = {
        transactionType: TransactionTypeKeys.SIGNED,
        signedTx: 'signed-transaction-data',
      };

      const response: Partial<AxiosResponse> = {
        data: {
          data: {
            transactionType: 'signed',
            transactionId: '0c4b319d-1709-4ee3-b6c3-234f9407e8a5',
            signedTx: 'signed-transaction-data',
            from: '0xSender',
            to: '0xReceiver',
            value: 100,
            gasLimit: 21000,
            maxFeePerGas: 1000000000,
            maxPriorityFeePerGas: 2000000000,
            nonce: 1,
            data: '0x',
            chainId: '1',
            status: 'pending',
          },
        },
      };

      httpClientMock.post.mockResolvedValue(response as AxiosResponse);

      const result = await transaction.createTransaction(transactionData);
      expect(httpClientMock.post).toHaveBeenCalledWith(
        '/transactions',
        transactionData,
      );
      expect(result).toEqual(TransactionSchema.parse(response.data.data));
    });

    it('should handle errors when creating a signed transaction', async () => {
      const transactionData: ITransactionSigned = {
        transactionType: 'signed',
        signedTx: 'signed-transaction-data',
      };

      httpClientMock.post = jest.fn().mockRejectedValue(new Error('error'));

      await expect(
        transaction.createTransaction(transactionData),
      ).rejects.toThrow('error');
    });
  });

  describe('getTransactionById', () => {
    it('should get a transaction by ID', async () => {
      const transactionId = '1234';

      const response: Partial<AxiosResponse> = {
        data: {
          data: {
            transactionType: 'signed',
            transactionId: '0c4b319d-1709-4ee3-b6c3-234f9407e8a5',
            signedTx: 'signed-transaction-data',
            from: '0xSender',
            to: '0xReceiver',
            value: 100,
            gasLimit: 21000,
            maxFeePerGas: 1000000000,
            maxPriorityFeePerGas: 2000000000,
            nonce: 1,
            data: '0x',
            chainId: '1',
            status: 'pending',
          },
        },
      };

      httpClientMock.get.mockResolvedValue(response as AxiosResponse);

      const result = await transaction.getTransactionById(transactionId);
      expect(httpClientMock.get).toHaveBeenCalledWith(
        `/transactions/${transactionId}`,
      );
      expect(result).toEqual(TransactionSchema.parse(response.data.data));
    });

    it('should handle errors when getting a transaction by ID', async () => {
      const transactionId = '1234';

      const error = new Error('Failed to get transaction');
      httpClientMock.get.mockRejectedValue(error);

      await expect(
        transaction.getTransactionById(transactionId),
      ).rejects.toThrowError(error);
    });
  });
});