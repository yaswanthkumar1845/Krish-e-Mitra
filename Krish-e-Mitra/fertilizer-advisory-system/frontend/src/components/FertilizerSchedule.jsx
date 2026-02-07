import { useState } from 'react';
import { getTranslation } from '../i18n/translations';

export default function FertilizerSchedule({ schedule, language }) {
    const [expandedStage, setExpandedStage] = useState(0);

    const t = (key) => getTranslation(key, language);

    if (!schedule || !schedule.stages) {
        return null;
    }

    const toggleStage = (index) => {
        setExpandedStage(expandedStage === index ? -1 : index);
    };

    return (
        <div className="card mb-6 bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-700">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-100 mb-2 flex items-center gap-2">
                    📅 {t('stageSchedule')}
                </h3>
                <p className="text-gray-400">
                    {t('sowingDate')}: <span className="text-green-400 font-semibold">{schedule.sowing_date_formatted}</span>
                    {' • '}
                    {schedule.total_stages} {t('stages')}
                    {' • '}
                    {schedule.total_duration_days} {t('days')}
                </p>
            </div>

            {/* Timeline */}
            <div className="mb-8 overflow-x-auto">
                <div className="flex items-center justify-between min-w-[600px] px-4">
                    {schedule.stages.map((stage, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                            {/* Stage Icon */}
                            <div
                                className={`text-4xl mb-2 cursor-pointer transition-transform hover:scale-110 ${expandedStage === index ? 'scale-125' : ''
                                    }`}
                                onClick={() => toggleStage(index)}
                            >
                                {stage.icon}
                            </div>

                            {/* Stage Name */}
                            <div className="text-center">
                                <p className="text-xs font-semibold text-green-400">
                                    {language === 'en' ? stage.stage_name : stage.stage_name_te}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {t('day')} {stage.days_after_sowing}
                                </p>
                            </div>

                            {/* Connector Line */}
                            {index < schedule.stages.length - 1 && (
                                <div className="absolute h-0.5 bg-green-700 w-full top-8 left-1/2 -z-10"
                                    style={{ width: `calc(100% / ${schedule.stages.length})` }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Stage Cards */}
            <div className="space-y-4">
                {schedule.stages.map((stage, index) => (
                    <div
                        key={index}
                        className={`border border-green-800 rounded-lg overflow-hidden transition-all ${expandedStage === index ? 'bg-green-900/30' : 'bg-gray-800/50'
                            }`}
                    >
                        {/* Stage Header */}
                        <div
                            className="p-4 cursor-pointer hover:bg-green-900/20 transition-colors"
                            onClick={() => toggleStage(index)}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{stage.icon}</span>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-100">
                                            {language === 'en' ? stage.stage_name : stage.stage_name_te}
                                        </h4>
                                        <p className="text-sm text-gray-400">
                                            {t('day')} {stage.days_after_sowing} • {stage.application_date_formatted}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-green-400 font-semibold">
                                        {stage.fertilizers.length} {t('fertilizers')}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {expandedStage === index ? '▼' : '▶'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stage Details (Expandable) */}
                        {expandedStage === index && (
                            <div className="p-4 border-t border-green-800 bg-gray-900/30">
                                {/* Fertilizers */}
                                <div className="mb-4">
                                    <h5 className="text-sm font-semibold text-gray-300 mb-3">
                                        {t('fertilizersToApply')}:
                                    </h5>
                                    <div className="space-y-2">
                                        {stage.fertilizers.map((fert, fertIndex) => (
                                            <div
                                                key={fertIndex}
                                                className="flex justify-between items-center p-3 bg-gray-800 rounded-lg"
                                            >
                                                <div>
                                                    <p className="font-semibold text-gray-100">
                                                        {language === 'en' ? fert.name : fert.name_te}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {fert.percentage}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-green-400 font-bold">
                                                        {fert.amount_kg} {t('kg')}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {fert.amount_per_acre} {t('kg')}/{t('acre')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Instructions */}
                                <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                                    <h5 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                                        💡 {t('applicationInstructions')}
                                    </h5>
                                    <p className="text-sm text-gray-300">
                                        {language === 'en' ? stage.instructions_en : stage.instructions_te}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Summary Footer */}
            <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400">
                    <span className="text-green-400 font-semibold">💡 {t('tip')}:</span>{' '}
                    {language === 'en'
                        ? 'Click on any stage to view detailed fertilizer recommendations and application instructions.'
                        : 'వివరమైన ఎరువుల సిఫార్సులు మరియు అప్లికేషన్ సూచనలను చూడటానికి ఏదైనా దశపై క్లిక్ చేయండి.'
                    }
                </p>
            </div>
        </div>
    );
}
