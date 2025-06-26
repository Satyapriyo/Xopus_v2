'use client';

import { useState } from 'react';
import { testRpcEndpoints, testContractConnection, runNetworkDiagnostics } from '@/lib/network-diagnostics';
import { x402PaymentService } from '@/lib/x402-contract';

export default function NetworkTestPage() {
    const [testResults, setTestResults] = useState<any>(null);
    const [contractInfo, setContractInfo] = useState<any>(null);
    const [aiTestResult, setAiTestResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const runRpcTest = async () => {
        setIsLoading(true);
        try {
            console.log('Starting RPC endpoint tests...');
            const bestEndpoint = await testRpcEndpoints();
            setTestResults(bestEndpoint);
        } catch (error) {
            console.error('RPC test failed:', error);
            setTestResults('Error: ' + (error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const runContractTest = async () => {
        setIsLoading(true);
        try {
            console.log('Testing contract...');
            const contractAddress = process.env.NEXT_PUBLIC_X402_CONTRACT_ADDRESS;
            if (!contractAddress) {
                setContractInfo('Error: No contract address configured');
                return;
            }

            const exists = await testContractConnection(contractAddress);
            setContractInfo(exists ? 'Contract exists and is accessible' : 'Contract not found or not accessible');
        } catch (error) {
            console.error('Contract test failed:', error);
            setContractInfo('Error: ' + (error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const getContractInfo = async () => {
        setIsLoading(true);
        try {
            if (!x402PaymentService) {
                setContractInfo('Error: Payment service not available (server-side)');
                return;
            }

            const info = await x402PaymentService.getContractInfo();
            setContractInfo(info);
        } catch (error) {
            console.error('Get contract info failed:', error);
            setContractInfo('Error: ' + (error as Error).message);
        } finally {
            setIsLoading(false);
        }
    }; const runFullDiagnostics = async () => {
        setIsLoading(true);
        try {
            console.log('Running full network diagnostics...');
            await runNetworkDiagnostics();
            console.log('Diagnostics complete - check console for details');
        } catch (error) {
            console.error('Full diagnostics failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const testAI = async () => {
        setIsLoading(true);
        try {
            console.log('🤖 Testing DeepSeek V3 AI...');

            const response = await fetch('/api/test-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: 'Hello! Can you tell me what AI model you are and confirm you are working properly?'
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('✅ AI test successful:', data);
                setAiTestResult(data);
            } else {
                console.error('❌ AI test failed:', data);
                setAiTestResult({ error: data.error, details: data.details, config: data.config });
            }

        } catch (error) {
            console.error('❌ AI test request failed:', error);
            setAiTestResult({ error: 'Network error: ' + (error as Error).message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Network & Contract Diagnostics</h1>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">RPC Endpoint Tests</h2>
                    <div className="space-y-4">
                        <button
                            onClick={runRpcTest}
                            disabled={isLoading}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                            {isLoading ? 'Testing...' : 'Test RPC Endpoints'}
                        </button>
                        {testResults && (
                            <div className="mt-4 p-4 bg-gray-50 rounded">
                                <h3 className="font-semibold">Results:</h3>
                                <pre className="text-sm text-gray-700 whitespace-pre-wrap">{JSON.stringify(testResults, null, 2)}</pre>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Payment Flow Test</h2>
                    <div className="space-y-4">
                        <button
                            onClick={async () => {
                                if (!x402PaymentService) {
                                    console.error('Payment service not available');
                                    return;
                                }

                                try {
                                    console.log('🧪 Testing payment flow...');

                                    // Test getting payment amount
                                    const amount = await x402PaymentService.getPaymentAmount();
                                    console.log('✅ Payment amount test successful:', amount.toString());

                                    // Test getting payment receiver
                                    const receiver = await x402PaymentService.getPaymentReceiver();
                                    console.log('✅ Payment receiver test successful:', receiver);

                                    console.log('🎉 Payment flow test complete - check console for details');
                                } catch (error) {
                                    console.error('❌ Payment flow test failed:', error);
                                }
                            }}
                            disabled={isLoading}
                            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                            {isLoading ? 'Testing...' : 'Test Payment Flow (No Wallet)'}
                        </button>
                        <p className="text-sm text-gray-600">
                            This tests the payment flow without requiring a wallet connection
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Contract Tests</h2>
                    <div className="space-y-4">
                        <div className="flex space-x-4">
                            <button
                                onClick={runContractTest}
                                disabled={isLoading}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                            >
                                {isLoading ? 'Testing...' : 'Test Contract Connection'}
                            </button>
                            <button
                                onClick={getContractInfo}
                                disabled={isLoading}
                                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                            >
                                {isLoading ? 'Loading...' : 'Get Contract Info'}
                            </button>
                        </div>
                        {contractInfo && (
                            <div className="mt-4 p-4 bg-gray-50 rounded">
                                <h3 className="font-semibold">Contract Info:</h3>
                                <pre className="text-sm text-gray-700 whitespace-pre-wrap">{JSON.stringify(contractInfo, null, 2)}</pre>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Full Diagnostics</h2>
                    <div className="space-y-4">
                        <button
                            onClick={runFullDiagnostics}
                            disabled={isLoading}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                            {isLoading ? 'Running...' : 'Run Full Network Diagnostics'}
                        </button>
                        <p className="text-sm text-gray-600">
                            Check the browser console for detailed results
                        </p>
                    </div>
                </div>

                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800 mb-2">Environment Info:</h3>
                    <div className="text-sm text-yellow-700">
                        <p><strong>Contract Address:</strong> {process.env.NEXT_PUBLIC_X402_CONTRACT_ADDRESS || 'Not configured'}</p>
                        <p><strong>Chain ID:</strong> {process.env.NEXT_PUBLIC_CHAIN_ID || 'Not configured'}</p>
                        <p><strong>RPC URL:</strong> {process.env.NEXT_PUBLIC_RPC_URL || 'Not configured'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
