import OpenAI from 'openai';
import { BlockchainMetrics } from '@/lib/blockchain-api';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

interface Analysis {
    networkAnalysis: {
        ethereum: {
            title: string;
            content: string;
        };
        bitcoin: {
            title: string;
            content: string;
        };
        solana: {
            title: string;
            content: string;
        };
    };
    insights: Array<{
        type: 'info' | 'warning' | 'alert';
        message: string;
        confidence: number;
    }>;
    predictions: Array<{
        timestamp: string;
        energyUsageKwh: number;
        emissionsKgCo2: number;
        confidence: number;
    }>;
}

export async function analyzeBlockchainData(metrics: BlockchainMetrics[]): Promise<Analysis> {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are an expert in blockchain sustainability analysis. Analyze the provided metrics and generate detailed insights for each blockchain network (Ethereum, Bitcoin, and Solana).
                    Return the response in JSON format with:
                    {
                        "networkAnalysis": {
                            "ethereum": { "title": "Ethereum Sustainability Analysis", "content": "detailed analysis..." },
                            "bitcoin": { "title": "Bitcoin Sustainability Analysis", "content": "detailed analysis..." },
                            "solana": { "title": "Solana Sustainability Analysis", "content": "detailed analysis..." }
                        },
                        "insights": [
                            { "type": "info/warning/alert", "message": "insight message", "confidence": 0-1 }
                        ],
                        "predictions": [
                            { "timestamp": "ISO date", "energyUsageKwh": number, "emissionsKgCo2": number, "confidence": 0-1 }
                        ]
                    }`
                },
                {
                    role: "user",
                    content: `Analyze these blockchain metrics and provide detailed analysis for each network: ${JSON.stringify(metrics, null, 2)}`
                }
            ]
        });

        if (!response.choices[0].message.content) {
            throw new Error('No content in OpenAI response');
        }

        const analysis = JSON.parse(response.choices[0].message.content);
        return {
            networkAnalysis: analysis.networkAnalysis || getDefaultNetworkAnalysis(),
            insights: analysis.insights || [],
            predictions: analysis.predictions || []
        };
    } catch (error) {
        console.error('Error analyzing blockchain data:', error);
        return {
            networkAnalysis: getDefaultNetworkAnalysis(),
            insights: [],
            predictions: []
        };
    }
}

function getDefaultNetworkAnalysis() {
    return {
        ethereum: {
            title: "Ethereum Sustainability Analysis",
            content: "Ethereum's transition to Proof of Stake has significantly reduced its energy consumption by ~99.95%. Current metrics show continued efficiency improvements and lower environmental impact compared to PoW chains."
        },
        bitcoin: {
            title: "Bitcoin Sustainability Analysis",
            content: "Bitcoin's Proof of Work consensus mechanism continues to require significant energy resources. However, there's a growing trend towards using renewable energy sources in mining operations, which could help reduce its environmental impact."
        },
        solana: {
            title: "Solana Sustainability Analysis",
            content: "Solana's unique Proof of History mechanism, combined with Proof of Stake, enables high throughput while maintaining relatively low energy consumption. The network shows promising sustainability metrics compared to traditional PoW systems."
        }
    };
}

export async function generateSustainabilityReport(metrics: BlockchainMetrics[]): Promise<any> {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `Generate a comprehensive sustainability report based on the blockchain metrics provided.
                    The report must include these specific sections:
                    1. Executive Summary
                    2. Ethereum Network - Detailed analysis of Ethereum's environmental metrics
                    3. Bitcoin Network - Detailed analysis of Bitcoin's environmental metrics
                    4. Solana Network - Detailed analysis of Solana's environmental metrics
                    5. Conclusion
                    
                    Return the response in this JSON format:
                    {
                        "summary": "Executive summary text",
                        "sections": [
                            {
                                "title": "Ethereum Network",
                                "content": "Detailed analysis of Ethereum...",
                                "key_metrics": ["Energy usage: X TWh", "CO2 emissions: Y tons"],
                                "recommendations": ["Recommendation 1", "Recommendation 2"]
                            },
                            // Similar structure for Bitcoin and Solana sections
                        ],
                        "conclusion": "Conclusion text"
                    }`
                },
                {
                    role: "user",
                    content: `Generate sustainability report for these metrics: ${JSON.stringify(metrics, null, 2)}`
                }
            ],
            response_format: { type: "json_object" }
        });

        if (!response.choices[0].message.content) {
            throw new Error('No content in OpenAI response');
        }

        const parsed = JSON.parse(response.choices[0].message.content);
        return parsed || getDefaultReport(metrics);

    } catch (error) {
        console.error('Error generating sustainability report:', error);
        return getDefaultReport(metrics);
    }
}

function getDefaultReport(metrics: BlockchainMetrics[]) {
    const ethereum = metrics.find(m => m.network === 'ethereum');
    const bitcoin = metrics.find(m => m.network === 'bitcoin');
    const solana = metrics.find(m => m.network === 'solana');

    return {
        summary: "This sustainability report provides an analysis of the environmental impact of the Ethereum, Bitcoin, and Solana blockchain networks over a 24-hour timeframe. The report includes metrics related to energy usage, CO2 emissions, water usage, and e-waste generation.",
        sections: [
            {
                title: "Ethereum Network",
                content: `Ethereum's transition to Proof of Stake has significantly reduced its environmental footprint. Current metrics show annual energy consumption of ${ethereum?.energyUsageKwh.toFixed(2)} TWh, resulting in ${ethereum?.emissionsKgCo2.toFixed(2)} tons of CO2 emissions. The network's water usage for cooling systems is estimated at ${ethereum?.waterUsageLiters.toFixed(2)} billion liters annually, with e-waste generation at ${ethereum?.eWasteKg.toFixed(2)} tons per year.`,
                key_metrics: [
                    `Energy Usage: ${ethereum?.energyUsageKwh.toFixed(2)} TWh/year`,
                    `CO2 Emissions: ${ethereum?.emissionsKgCo2.toFixed(2)} tons/year`,
                    `Water Usage: ${ethereum?.waterUsageLiters.toFixed(2)} billion liters/year`,
                    `E-waste: ${ethereum?.eWasteKg.toFixed(2)} tons/year`
                ],
                recommendations: [
                    "Continue optimizing the Proof of Stake consensus mechanism",
                    "Implement more energy-efficient validator hardware",
                    "Explore renewable energy sources for validator nodes"
                ]
            },
            {
                title: "Bitcoin Network",
                content: `Bitcoin's Proof of Work consensus mechanism continues to require significant computational resources. The network currently consumes ${bitcoin?.energyUsageKwh.toFixed(2)} TWh annually, generating ${bitcoin?.emissionsKgCo2.toFixed(2)} tons of CO2. Water consumption for mining operations reaches ${bitcoin?.waterUsageLiters.toFixed(2)} billion liters per year, while e-waste from mining hardware amounts to ${bitcoin?.eWasteKg.toFixed(2)} tons annually.`,
                key_metrics: [
                    `Energy Usage: ${bitcoin?.energyUsageKwh.toFixed(2)} TWh/year`,
                    `CO2 Emissions: ${bitcoin?.emissionsKgCo2.toFixed(2)} tons/year`,
                    `Water Usage: ${bitcoin?.waterUsageLiters.toFixed(2)} billion liters/year`,
                    `E-waste: ${bitcoin?.eWasteKg.toFixed(2)} tons/year`
                ],
                recommendations: [
                    "Increase adoption of renewable energy sources",
                    "Improve mining hardware efficiency",
                    "Implement better cooling systems to reduce water usage"
                ]
            },
            {
                title: "Solana Network",
                content: `Solana's hybrid Proof of Stake and Proof of History mechanism demonstrates improved efficiency. The network uses ${solana?.energyUsageKwh.toFixed(2)} TWh of energy annually, producing ${solana?.emissionsKgCo2.toFixed(2)} tons of CO2. Water consumption is estimated at ${solana?.waterUsageLiters.toFixed(2)} billion liters per year, with e-waste generation at ${solana?.eWasteKg.toFixed(2)} tons annually.`,
                key_metrics: [
                    `Energy Usage: ${solana?.energyUsageKwh.toFixed(2)} TWh/year`,
                    `CO2 Emissions: ${solana?.emissionsKgCo2.toFixed(2)} tons/year`,
                    `Water Usage: ${solana?.waterUsageLiters.toFixed(2)} billion liters/year`,
                    `E-waste: ${solana?.eWasteKg.toFixed(2)} tons/year`
                ],
                recommendations: [
                    "Optimize validator node distribution",
                    "Implement energy-efficient hardware requirements",
                    "Develop water conservation strategies for cooling systems"
                ]
            }
        ],
        conclusion: "The analysis reveals that the Ethereum network has the highest energy usage, CO2 emissions, water usage, and e-waste generation among the three blockchain networks. Solana network, while having the highest water usage, has relatively lower energy usage and emissions compared to Ethereum. Bitcoin network falls in between Ethereum and Solana in terms of environmental impact. It is recommended for all networks to explore more sustainable practices to reduce their carbon footprint and overall environmental impact."
    };
}

export async function getOptimizationSuggestions(metrics: any) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are an AI expert in blockchain sustainability. Analyze the provided metrics and generate specific optimization suggestions. 
                    Return a JSON array of suggestions, where each suggestion has:
                    - title: A brief, clear title
                    - description: Detailed explanation
                    - impact: "high", "medium", or "low"
                    - estimatedSavings: Estimated environmental savings
                    Format the response as valid JSON that can be parsed.`
                },
                {
                    role: "user",
                    content: `Generate optimization suggestions based on these metrics: ${JSON.stringify(metrics)}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            console.error('No content in OpenAI response');
            return getDefaultSuggestions();
        }

        return JSON.parse(content);
    } catch (error) {
        console.error('Error getting optimization suggestions:', error);
        return getDefaultSuggestions();
    }
}

function getDefaultSuggestions() {
    return [
        {
            title: "Implement Energy-Efficient Mining",
            description: "Transition to more energy-efficient mining hardware and optimize mining operations.",
            impact: "high",
            estimatedSavings: "30-40% reduction in energy consumption"
        },
        {
            title: "Utilize Renewable Energy Sources",
            description: "Switch to renewable energy sources for mining operations to reduce carbon footprint.",
            impact: "high",
            estimatedSavings: "Up to 70% reduction in carbon emissions"
        },
        {
            title: "Optimize Network Infrastructure",
            description: "Improve network topology and reduce redundant nodes to minimize energy waste.",
            impact: "medium",
            estimatedSavings: "15-20% reduction in network energy usage"
        }
    ];
} 