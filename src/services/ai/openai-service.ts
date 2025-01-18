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

export async function analyzeBlockchainData(metrics: BlockchainMetrics[], locale: string = 'en'): Promise<Analysis> {
    try {
        const systemPrompt = locale === 'uk' 
            ? `Ви експерт з аналізу сталості блокчейну. Проаналізуйте надані метрики та створіть детальні висновки для кожної блокчейн-мережі (Ethereum, Bitcoin та Solana).
               Поверніть відповідь у форматі JSON з:
               {
                   "networkAnalysis": {
                       "ethereum": { "title": "Аналіз Сталості Ethereum", "content": "детальний аналіз..." },
                       "bitcoin": { "title": "Аналіз Сталості Bitcoin", "content": "детальний аналіз..." },
                       "solana": { "title": "Аналіз Сталості Solana", "content": "детальний аналіз..." }
                   },
                   "insights": [
                       { "type": "info/warning/alert", "message": "повідомлення з висновком", "confidence": 0-1 }
                   ],
                   "predictions": [
                       { "timestamp": "ISO date", "energyUsageKwh": number, "emissionsKgCo2": number, "confidence": 0-1 }
                   ]
               }`
            : `You are an expert in blockchain sustainability analysis. Analyze the provided metrics and generate detailed insights for each blockchain network (Ethereum, Bitcoin, and Solana).
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
               }`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
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
            networkAnalysis: analysis.networkAnalysis || getDefaultNetworkAnalysis(locale),
            insights: analysis.insights || [],
            predictions: analysis.predictions || []
        };
    } catch (error) {
        console.error('Error analyzing blockchain data:', error);
        return {
            networkAnalysis: getDefaultNetworkAnalysis(locale),
            insights: [],
            predictions: []
        };
    }
}

function getDefaultNetworkAnalysis(locale: string = 'en') {
    return locale === 'uk' ? {
        ethereum: {
            title: "Аналіз Сталості Ethereum",
            content: "Перехід Ethereum на Proof of Stake значно знизив його енергоспоживання приблизно на 99.95%. Поточні метрики показують подальше покращення ефективності та зменшення впливу на довкілля порівняно з PoW ланцюгами."
        },
        bitcoin: {
            title: "Аналіз Сталості Bitcoin",
            content: "Механізм консенсусу Bitcoin Proof of Work продовжує вимагати значних енергетичних ресурсів. Проте спостерігається тенденція до збільшення використання відновлюваних джерел енергії в майнінгових операціях, що може допомогти зменшити його вплив на довкілля."
        },
        solana: {
            title: "Аналіз Сталості Solana",
            content: "Унікальний механізм Proof of History Solana у поєднанні з Proof of Stake забезпечує високу пропускну здатність при відносно низькому енергоспоживанні. Мережа демонструє перспективні показники сталості порівняно з традиційними системами PoW."
        }
    } : {
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

export async function generateSustainabilityReport(metrics: BlockchainMetrics[], locale: string = 'en'): Promise<any> {
    try {
        const systemPrompt = locale === 'uk'
            ? `Створіть комплексний звіт про сталий розвиток на основі наданих метрик блокчейну.
               Звіт повинен включати такі розділи:
               1. Короткий Огляд
               2. Мережа Ethereum - Детальний аналіз екологічних метрик Ethereum
               3. Мережа Bitcoin - Детальний аналіз екологічних метрик Bitcoin
               4. Мережа Solana - Детальний аналіз екологічних метрик Solana
               5. Висновок
               
               Поверніть відповідь у такому форматі JSON:
               {
                   "summary": "Текст короткого огляду",
                   "sections": [
                       {
                           "title": "Мережа Ethereum",
                           "content": "Детальний аналіз Ethereum...",
                           "key_metrics": ["Використання енергії: X ТВт·год", "Викиди CO2: Y тонн"],
                           "recommendations": ["Рекомендація 1", "Рекомендація 2"]
                       }
                   ],
                   "conclusion": "Текст висновку"
               }`
            : `Generate a comprehensive sustainability report based on the blockchain metrics provided.
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
                       }
                   ],
                   "conclusion": "Conclusion text"
               }`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
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
        return parsed || getDefaultReport(metrics, locale);

    } catch (error) {
        console.error('Error generating sustainability report:', error);
        return getDefaultReport(metrics, locale);
    }
}

function getDefaultReport(metrics: BlockchainMetrics[], locale: string = 'en') {
    const ethereum = metrics.find(m => m.network === 'ethereum');
    const bitcoin = metrics.find(m => m.network === 'bitcoin');
    const solana = metrics.find(m => m.network === 'solana');

    return {
        summary: locale === 'uk' 
            ? "Цей звіт про сталий розвиток надає аналіз впливу на довкілля блокчейн-мереж Ethereum, Bitcoin та Solana за 24-годинний період. Звіт включає метрики щодо використання енергії, викидів CO2, використання води та генерації електронних відходів."
            : "This sustainability report provides an analysis of the environmental impact of the Ethereum, Bitcoin, and Solana blockchain networks over a 24-hour timeframe. The report includes metrics related to energy usage, CO2 emissions, water usage, and e-waste generation.",
        sections: [
            {
                title: locale === 'uk' ? "Мережа Ethereum" : "Ethereum Network",
                content: locale === 'uk'
                    ? `Перехід Ethereum на Proof of Stake значно зменшив його вплив на довкілля. Поточні метрики показують річне споживання енергії ${ethereum?.energyUsageKwh.toFixed(2)} ТВт·год, що призводить до ${ethereum?.emissionsKgCo2.toFixed(2)} тонн викидів CO2. Використання води для систем охолодження оцінюється в ${ethereum?.waterUsageLiters.toFixed(2)} мільярдів літрів на рік, а генерація електронних відходів становить ${ethereum?.eWasteKg.toFixed(2)} тонн на рік.`
                    : `Ethereum's transition to Proof of Stake has significantly reduced its environmental footprint. Current metrics show annual energy consumption of ${ethereum?.energyUsageKwh.toFixed(2)} TWh, resulting in ${ethereum?.emissionsKgCo2.toFixed(2)} tons of CO2 emissions. The network's water usage for cooling systems is estimated at ${ethereum?.waterUsageLiters.toFixed(2)} billion liters annually, with e-waste generation at ${ethereum?.eWasteKg.toFixed(2)} tons per year.`,
                key_metrics: locale === 'uk' ? [
                    `Використання енергії: ${ethereum?.energyUsageKwh.toFixed(2)} ТВт·год/рік`,
                    `Викиди CO2: ${ethereum?.emissionsKgCo2.toFixed(2)} тонн/рік`,
                    `Використання води: ${ethereum?.waterUsageLiters.toFixed(2)} млрд л/рік`,
                    `Електронні відходи: ${ethereum?.eWasteKg.toFixed(2)} тонн/рік`
                ] : [
                    `Energy Usage: ${ethereum?.energyUsageKwh.toFixed(2)} TWh/year`,
                    `CO2 Emissions: ${ethereum?.emissionsKgCo2.toFixed(2)} tons/year`,
                    `Water Usage: ${ethereum?.waterUsageLiters.toFixed(2)} billion liters/year`,
                    `E-waste: ${ethereum?.eWasteKg.toFixed(2)} tons/year`
                ],
                recommendations: locale === 'uk' ? [
                    "Продовжити оптимізацію механізму консенсусу Proof of Stake",
                    "Впровадити більш енергоефективне обладнання для валідаторів",
                    "Дослідити використання відновлюваних джерел енергії для вузлів валідаторів"
                ] : [
                    "Continue optimizing the Proof of Stake consensus mechanism",
                    "Implement more energy-efficient validator hardware",
                    "Explore renewable energy sources for validator nodes"
                ]
            },
            {
                title: locale === 'uk' ? "Мережа Bitcoin" : "Bitcoin Network",
                content: locale === 'uk'
                    ? `Механізм консенсусу Bitcoin Proof of Work продовжує вимагати значних обчислювальних ресурсів. Мережа наразі споживає ${bitcoin?.energyUsageKwh.toFixed(2)} ТВт·год щорічно, генеруючи ${bitcoin?.emissionsKgCo2.toFixed(2)} тонн CO2. Споживання води для майнінгових операцій досягає ${bitcoin?.waterUsageLiters.toFixed(2)} мільярдів літрів на рік, тоді як електронні відходи від майнінгового обладнання становлять ${bitcoin?.eWasteKg.toFixed(2)} тонн щорічно.`
                    : `Bitcoin's Proof of Work consensus mechanism continues to require significant computational resources. The network currently consumes ${bitcoin?.energyUsageKwh.toFixed(2)} TWh annually, generating ${bitcoin?.emissionsKgCo2.toFixed(2)} tons of CO2. Water consumption for mining operations reaches ${bitcoin?.waterUsageLiters.toFixed(2)} billion liters per year, while e-waste from mining hardware amounts to ${bitcoin?.eWasteKg.toFixed(2)} tons annually.`,
                key_metrics: locale === 'uk' ? [
                    `Використання енергії: ${bitcoin?.energyUsageKwh.toFixed(2)} ТВт·год/рік`,
                    `Викиди CO2: ${bitcoin?.emissionsKgCo2.toFixed(2)} тонн/рік`,
                    `Використання води: ${bitcoin?.waterUsageLiters.toFixed(2)} млрд л/рік`,
                    `Електронні відходи: ${bitcoin?.eWasteKg.toFixed(2)} тонн/рік`
                ] : [
                    `Energy Usage: ${bitcoin?.energyUsageKwh.toFixed(2)} TWh/year`,
                    `CO2 Emissions: ${bitcoin?.emissionsKgCo2.toFixed(2)} tons/year`,
                    `Water Usage: ${bitcoin?.waterUsageLiters.toFixed(2)} billion liters/year`,
                    `E-waste: ${bitcoin?.eWasteKg.toFixed(2)} tons/year`
                ],
                recommendations: locale === 'uk' ? [
                    "Збільшити використання відновлюваних джерел енергії",
                    "Покращити ефективність майнінгового обладнання",
                    "Впровадити кращі системи охолодження для зменшення використання води"
                ] : [
                    "Increase adoption of renewable energy sources",
                    "Improve mining hardware efficiency",
                    "Implement better cooling systems to reduce water usage"
                ]
            },
            {
                title: locale === 'uk' ? "Мережа Solana" : "Solana Network",
                content: locale === 'uk'
                    ? `Гібридний механізм Proof of Stake та Proof of History Solana демонструє покращену ефективність. Мережа використовує ${solana?.energyUsageKwh.toFixed(2)} ТВт·год енергії щорічно, виробляючи ${solana?.emissionsKgCo2.toFixed(2)} тонн CO2. Споживання води оцінюється в ${solana?.waterUsageLiters.toFixed(2)} мільярдів літрів на рік, а генерація електронних відходів становить ${solana?.eWasteKg.toFixed(2)} тонн щорічно.`
                    : `Solana's hybrid Proof of Stake and Proof of History mechanism demonstrates improved efficiency. The network uses ${solana?.energyUsageKwh.toFixed(2)} TWh of energy annually, producing ${solana?.emissionsKgCo2.toFixed(2)} tons of CO2. Water consumption is estimated at ${solana?.waterUsageLiters.toFixed(2)} billion liters per year, with e-waste generation at ${solana?.eWasteKg.toFixed(2)} tons annually.`,
                key_metrics: locale === 'uk' ? [
                    `Використання енергії: ${solana?.energyUsageKwh.toFixed(2)} ТВт·год/рік`,
                    `Викиди CO2: ${solana?.emissionsKgCo2.toFixed(2)} тонн/рік`,
                    `Використання води: ${solana?.waterUsageLiters.toFixed(2)} млрд л/рік`,
                    `Електронні відходи: ${solana?.eWasteKg.toFixed(2)} тонн/рік`
                ] : [
                    `Energy Usage: ${solana?.energyUsageKwh.toFixed(2)} TWh/year`,
                    `CO2 Emissions: ${solana?.emissionsKgCo2.toFixed(2)} tons/year`,
                    `Water Usage: ${solana?.waterUsageLiters.toFixed(2)} billion liters/year`,
                    `E-waste: ${solana?.eWasteKg.toFixed(2)} tons/year`
                ],
                recommendations: locale === 'uk' ? [
                    "Оптимізувати розподіл вузлів валідаторів",
                    "Впровадити вимоги до енергоефективного обладнання",
                    "Розробити стратегії збереження води для систем охолодження"
                ] : [
                    "Optimize validator node distribution",
                    "Implement energy-efficient hardware requirements",
                    "Develop water conservation strategies for cooling systems"
                ]
            }
        ],
        conclusion: locale === 'uk'
            ? "Загалом, спостерігається позитивна тенденція до зменшення впливу на довкілля завдяки переходу на більш енергоефективні механізми консенсусу та впровадженню екологічних практик. Проте все ще існує значний простір для покращення, особливо у сфері використання відновлюваної енергії та зменшення електронних відходів."
            : "Overall, there is a positive trend towards reducing environmental impact through the adoption of more energy-efficient consensus mechanisms and sustainable practices. However, there remains significant room for improvement, particularly in renewable energy adoption and e-waste reduction."
    };
}

export async function getOptimizationSuggestions(metrics: any, locale: string = 'en') {
    try {
        const systemPrompt = locale === 'uk'
            ? `Ви ШІ-експерт зі сталості блокчейну. Проаналізуйте надані метрики та створіть конкретні пропозиції щодо оптимізації. 
               Поверніть масив пропозицій у форматі JSON, де кожна пропозиція має:
               - title: Короткий, чіткий заголовок
               - description: Детальне пояснення
               - impact: "high", "medium", або "low"
               - estimatedSavings: Оцінка екологічної економії
               Відформатуйте відповідь як валідний JSON, який можна розпарсити.`
            : `You are an AI expert in blockchain sustainability. Analyze the provided metrics and generate specific optimization suggestions. 
               Return a JSON array of suggestions, where each suggestion has:
               - title: A brief, clear title
               - description: Detailed explanation
               - impact: "high", "medium", or "low"
               - estimatedSavings: Estimated environmental savings
               Format the response as valid JSON that can be parsed.`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
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
            return getDefaultSuggestions(locale);
        }

        return JSON.parse(content);
    } catch (error) {
        console.error('Error getting optimization suggestions:', error);
        return getDefaultSuggestions(locale);
    }
}

function getDefaultSuggestions(locale: string = 'en') {
    return locale === 'uk' ? [
        {
            title: "Перехід на Відновлювані Джерела Енергії",
            description: "Впровадження сонячної та вітрової енергії для майнінгових операцій може значно зменшити вуглецевий слід.",
            impact: "high",
            estimatedSavings: "40-60% зменшення викидів CO2"
        },
        {
            title: "Оптимізація Систем Охолодження",
            description: "Впровадження ефективніших систем охолодження може значно зменшити споживання води та енергії.",
            impact: "medium",
            estimatedSavings: "25-30% економії води"
        },
        {
            title: "Програма Утилізації Обладнання",
            description: "Створення програми переробки старого майнінгового обладнання для зменшення електронних відходів.",
            impact: "medium",
            estimatedSavings: "20-25% зменшення е-відходів"
        }
    ] : [
        {
            title: "Transition to Renewable Energy",
            description: "Implementing solar and wind power for mining operations can significantly reduce carbon footprint.",
            impact: "high",
            estimatedSavings: "40-60% reduction in CO2 emissions"
        },
        {
            title: "Cooling System Optimization",
            description: "Implementing more efficient cooling systems can significantly reduce water and energy consumption.",
            impact: "medium",
            estimatedSavings: "25-30% water savings"
        },
        {
            title: "Hardware Recycling Program",
            description: "Establishing a recycling program for old mining equipment to reduce e-waste.",
            impact: "medium",
            estimatedSavings: "20-25% reduction in e-waste"
        }
    ];
} 