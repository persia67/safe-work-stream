import React, { forwardRef } from 'react';

interface PrintViewProps {
  formData: any;
}

const OccupationalHealthPrintView = forwardRef<HTMLDivElement, PrintViewProps>(
  ({ formData }, ref) => {
    const formatBoolean = (value: boolean | null | undefined) => value ? '✓' : '✗';
    
    const formatBooleanList = (obj: Record<string, boolean> | null, labels: Record<string, string>) => {
      if (!obj) return '-';
      const active = Object.entries(obj)
        .filter(([_, val]) => val)
        .map(([key]) => labels[key] || key);
      return active.length > 0 ? active.join('، ') : '-';
    };

    const physicalHazardLabels: Record<string, string> = {
      noise: 'صدا',
      vibration: 'ارتعاش',
      ionizing_radiation: 'پرتو یونساز',
      non_ionizing_radiation: 'پرتو غیریونساز',
      heat_stress: 'استرس حرارتی'
    };

    const chemicalHazardLabels: Record<string, string> = {
      dust: 'گرد و غبار',
      metal_fumes: 'دود فلزات',
      solvents: 'حلال‌ها',
      acids_bases: 'اسید و باز',
      gases: 'گازها',
      pesticides: 'سموم'
    };

    const biologicalHazardLabels: Record<string, string> = {
      bacteria: 'باکتری',
      virus: 'ویروس',
      parasite: 'انگل',
      bites: 'گزش و گاز گرفتگی'
    };

    const ergonomicHazardLabels: Record<string, string> = {
      prolonged_sitting: 'نشستن طولانی',
      prolonged_standing: 'ایستادن طولانی',
      repetitive_work: 'کار تکراری',
      heavy_lifting: 'حمل بار سنگین',
      awkward_posture: 'پوسچر نامناسب'
    };

    const psychologicalHazardLabels: Record<string, string> = {
      shift_work: 'کار شیفتی',
      work_stress: 'استرس شغلی'
    };

    const generalSymptomLabels: Record<string, string> = {
      weight_loss: 'کاهش وزن',
      appetite_loss: 'بی‌اشتهایی',
      fatigue: 'خستگی',
      sleep_disorder: 'اختلال خواب',
      excessive_sweating: 'تعریق زیاد',
      heat_cold_intolerance: 'عدم تحمل گرما/سرما',
      fever: 'تب'
    };

    const eyeSymptomLabels: Record<string, string> = {
      vision_reduction: 'کاهش بینایی',
      blurred_vision: 'تاری دید',
      eye_fatigue: 'خستگی چشم',
      double_vision: 'دوبینی',
      burning: 'سوزش',
      itching: 'خارش',
      light_sensitivity: 'حساسیت به نور',
      tearing: 'اشک‌ریزش'
    };

    const respiratorySymptomLabels: Record<string, string> = {
      cough: 'سرفه',
      sputum: 'خلط',
      dyspnea: 'تنگی نفس',
      wheezing: 'خس‌خس',
      chest_pain: 'درد قفسه سینه'
    };

    const cardiovascularSymptomLabels: Record<string, string> = {
      chest_pain: 'درد قفسه سینه',
      palpitation: 'تپش قلب',
      nocturnal_dyspnea: 'تنگی نفس شبانه',
      orthopnea: 'ارتوپنه',
      cyanosis: 'سیانوز',
      syncope: 'غش'
    };

    const musculoskeletalSymptomLabels: Record<string, string> = {
      joint_stiffness: 'خشکی مفصل',
      back_pain: 'کمردرد',
      knee_pain: 'زانودرد',
      shoulder_pain: 'شانه‌درد',
      other_joint_pain: 'درد سایر مفاصل'
    };

    const neurologicalSymptomLabels: Record<string, string> = {
      headache: 'سردرد',
      dizziness: 'سرگیجه',
      tremor: 'لرزش',
      memory_problems: 'اختلال حافظه',
      seizure_history: 'سابقه تشنج',
      finger_paresthesia: 'پارستزی انگشتان'
    };

    return (
      <div ref={ref} className="print-container bg-white text-black p-8 font-sans" dir="rtl">
        <style>
          {`
            @media print {
              @page {
                size: A4;
                margin: 15mm;
              }
              .print-container {
                font-size: 10pt;
                line-height: 1.4;
              }
              .page-break {
                page-break-before: always;
              }
              .no-break {
                page-break-inside: avoid;
              }
            }
            .print-container table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 12px;
            }
            .print-container th, .print-container td {
              border: 1px solid #333;
              padding: 6px 8px;
              text-align: right;
            }
            .print-container th {
              background-color: #e5e5e5;
              font-weight: bold;
            }
            .print-container h1 {
              font-size: 16pt;
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .print-container h2 {
              font-size: 12pt;
              background-color: #333;
              color: white;
              padding: 6px 10px;
              margin-top: 16px;
              margin-bottom: 8px;
            }
            .print-container h3 {
              font-size: 11pt;
              border-bottom: 1px solid #666;
              padding-bottom: 4px;
              margin-top: 12px;
              margin-bottom: 6px;
            }
            .field-row {
              display: flex;
              gap: 20px;
              margin-bottom: 6px;
            }
            .field-item {
              flex: 1;
            }
            .field-label {
              font-weight: bold;
              display: inline;
            }
            .header-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              font-size: 9pt;
            }
          `}
        </style>

        {/* Header */}
        <div className="header-info">
          <span>وزارت بهداشت، درمان و آموزش پزشکی</span>
          <span>فرم پرونده سلامت شغلی</span>
          <span>تاریخ: {new Date().toLocaleDateString('fa-IR')}</span>
        </div>

        <h1>پرونده سلامت شغلی کارگر</h1>

        {/* Section 1: Personal Information */}
        <div className="no-break">
          <h2>۱- مشخصات فردی</h2>
          <table>
            <tbody>
              <tr>
                <th>نام و نام خانوادگی</th>
                <td>{formData.employee_name || '-'}</td>
                <th>نام پدر</th>
                <td>{formData.father_name || '-'}</td>
              </tr>
              <tr>
                <th>کد ملی</th>
                <td>{formData.national_code || '-'}</td>
                <th>کد پرسنلی</th>
                <td>{formData.employee_id || '-'}</td>
              </tr>
              <tr>
                <th>جنسیت</th>
                <td>{formData.gender || '-'}</td>
                <th>سال تولد</th>
                <td>{formData.birth_year || '-'}</td>
              </tr>
              <tr>
                <th>وضعیت تأهل</th>
                <td>{formData.marital_status || '-'}</td>
                <th>تعداد فرزندان</th>
                <td>{formData.children_count || '0'}</td>
              </tr>
              <tr>
                <th>وضعیت نظام وظیفه</th>
                <td>{formData.military_status || '-'}</td>
                <th>نوع خدمت</th>
                <td>{formData.military_service_type || '-'}</td>
              </tr>
              <tr>
                <th>معافیت پزشکی</th>
                <td colSpan={3}>{formData.medical_exemption ? `بله - ${formData.medical_exemption_reason || ''}` : 'خیر'}</td>
              </tr>
              <tr>
                <th>آدرس محل کار</th>
                <td colSpan={3}>{formData.work_address || '-'}</td>
              </tr>
              <tr>
                <th>تلفن محل کار</th>
                <td colSpan={3}>{formData.work_phone || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 2: Hazardous Factors */}
        <div className="no-break">
          <h2>۲- عوامل زیان‌آور محیط کار</h2>
          <table>
            <tbody>
              <tr>
                <th>عوامل فیزیکی</th>
                <td>{formatBooleanList(formData.physical_hazards, physicalHazardLabels)}</td>
              </tr>
              <tr>
                <th>عوامل شیمیایی</th>
                <td>{formatBooleanList(formData.chemical_hazards, chemicalHazardLabels)}</td>
              </tr>
              <tr>
                <th>عوامل بیولوژیکی</th>
                <td>{formatBooleanList(formData.biological_hazards, biologicalHazardLabels)}</td>
              </tr>
              <tr>
                <th>عوامل ارگونومیکی</th>
                <td>{formatBooleanList(formData.ergonomic_hazards, ergonomicHazardLabels)}</td>
              </tr>
              <tr>
                <th>عوامل روانشناختی</th>
                <td>{formatBooleanList(formData.psychological_hazards, psychologicalHazardLabels)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 3: Medical History */}
        <div className="no-break">
          <h2>۳- سوابق پزشکی</h2>
          <table>
            <tbody>
              <tr>
                <th>سابقه بیماری قبلی</th>
                <td>{formatBoolean(formData.has_prior_illness)}</td>
                <th>سابقه آلرژی</th>
                <td>{formData.has_allergies ? `بله - ${formData.allergy_details || ''}` : 'خیر'}</td>
              </tr>
              <tr>
                <th>سابقه بستری</th>
                <td>{formData.hospitalization_history ? `بله - ${formData.hospitalization_details || ''}` : 'خیر'}</td>
                <th>سابقه جراحی</th>
                <td>{formData.surgery_history ? `بله - ${formData.surgery_details || ''}` : 'خیر'}</td>
              </tr>
              <tr>
                <th>سابقه بیماری مزمن یا سرطان در خانواده</th>
                <td colSpan={3}>{formData.family_chronic_disease_cancer ? `بله - ${formData.family_disease_details || ''}` : 'خیر'}</td>
              </tr>
              <tr>
                <th>مصرف دارو</th>
                <td>{formData.current_medications ? `بله - ${formData.medication_details || ''}` : 'خیر'}</td>
                <th>استعمال دخانیات</th>
                <td>{formData.currently_smoking ? `بله - ${formData.smoking_details || ''}` : 'خیر'}</td>
              </tr>
              <tr>
                <th>سابقه حادثه شغلی</th>
                <td colSpan={3}>{formData.occupational_accident_history ? `بله - ${formData.accident_details || ''}` : 'خیر'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="page-break"></div>

        {/* Section 4: Physical Examination */}
        <div className="no-break">
          <h2>۴- معاینات بالینی</h2>
          <h3>مشخصات آنتروپومتریک</h3>
          <table>
            <tbody>
              <tr>
                <th>نوع معاینه</th>
                <td>{formData.examination_type || '-'}</td>
                <th>قد (سانتی‌متر)</th>
                <td>{formData.height_cm || '-'}</td>
              </tr>
              <tr>
                <th>وزن (کیلوگرم)</th>
                <td>{formData.weight_kg || '-'}</td>
                <th>BMI</th>
                <td>{formData.bmi || '-'}</td>
              </tr>
              <tr>
                <th>فشار خون</th>
                <td>{formData.blood_pressure_systolic && formData.blood_pressure_diastolic ? `${formData.blood_pressure_systolic}/${formData.blood_pressure_diastolic}` : '-'}</td>
                <th>نبض (در دقیقه)</th>
                <td>{formData.pulse_rate || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 5: Symptoms */}
        <div className="no-break">
          <h2>۵- علائم بالینی</h2>
          <table>
            <tbody>
              <tr>
                <th>علائم عمومی</th>
                <td>{formatBooleanList(formData.general_symptoms, generalSymptomLabels)}</td>
              </tr>
              <tr>
                <th>علائم چشمی</th>
                <td>{formatBooleanList(formData.eye_symptoms, eyeSymptomLabels)}</td>
              </tr>
              <tr>
                <th>علائم تنفسی</th>
                <td>{formatBooleanList(formData.respiratory_symptoms, respiratorySymptomLabels)}</td>
              </tr>
              <tr>
                <th>علائم قلبی-عروقی</th>
                <td>{formatBooleanList(formData.cardiovascular_symptoms, cardiovascularSymptomLabels)}</td>
              </tr>
              <tr>
                <th>علائم اسکلتی-عضلانی</th>
                <td>{formatBooleanList(formData.musculoskeletal_symptoms, musculoskeletalSymptomLabels)}</td>
              </tr>
              <tr>
                <th>علائم عصبی</th>
                <td>{formatBooleanList(formData.neurological_symptoms, neurologicalSymptomLabels)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 6: Lab Tests */}
        <div className="no-break">
          <h2>۶- آزمایشات</h2>
          <table>
            <tbody>
              <tr>
                <th>WBC</th>
                <td>{formData.lab_tests?.wbc || '-'}</td>
                <th>RBC</th>
                <td>{formData.lab_tests?.rbc || '-'}</td>
                <th>Hb</th>
                <td>{formData.lab_tests?.hb || '-'}</td>
              </tr>
              <tr>
                <th>Hct</th>
                <td>{formData.lab_tests?.hct || '-'}</td>
                <th>PLT</th>
                <td>{formData.lab_tests?.plt || '-'}</td>
                <th>FBS</th>
                <td>{formData.lab_tests?.fbs || '-'}</td>
              </tr>
              <tr>
                <th>Cholesterol</th>
                <td>{formData.lab_tests?.cholesterol || '-'}</td>
                <th>TG</th>
                <td>{formData.lab_tests?.tg || '-'}</td>
                <th>LDL</th>
                <td>{formData.lab_tests?.ldl || '-'}</td>
              </tr>
              <tr>
                <th>HDL</th>
                <td>{formData.lab_tests?.hdl || '-'}</td>
                <th>BUN</th>
                <td>{formData.lab_tests?.bun || '-'}</td>
                <th>Cr</th>
                <td>{formData.lab_tests?.cr || '-'}</td>
              </tr>
              <tr>
                <th>ALT</th>
                <td>{formData.lab_tests?.alt || '-'}</td>
                <th>AST</th>
                <td>{formData.lab_tests?.ast || '-'}</td>
                <th>ALP</th>
                <td>{formData.lab_tests?.alk_ph || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 7: Paraclinical */}
        <div className="no-break">
          <h2>۷- پاراکلینیک</h2>
          <h3>بینایی‌سنجی</h3>
          <table>
            <tbody>
              <tr>
                <th>دید چشم راست</th>
                <td>{formData.vision_acuity_right || '-'}</td>
                <th>دید چشم راست (اصلاح شده)</th>
                <td>{formData.vision_acuity_right_corrected || '-'}</td>
              </tr>
              <tr>
                <th>دید چشم چپ</th>
                <td>{formData.vision_acuity_left || '-'}</td>
                <th>دید چشم چپ (اصلاح شده)</th>
                <td>{formData.vision_acuity_left_corrected || '-'}</td>
              </tr>
              <tr>
                <th>دید رنگ راست</th>
                <td>{formData.color_vision_right || '-'}</td>
                <th>دید رنگ چپ</th>
                <td>{formData.color_vision_left || '-'}</td>
              </tr>
              <tr>
                <th>عمق‌سنجی</th>
                <td colSpan={3}>{formData.depth_perception || '-'}</td>
              </tr>
            </tbody>
          </table>

          <h3>شنوایی‌سنجی</h3>
          <table>
            <tbody>
              <tr>
                <th>500Hz</th>
                <td>{formData.audiometry_results?.freq_500 || '-'}</td>
                <th>1000Hz</th>
                <td>{formData.audiometry_results?.freq_1000 || '-'}</td>
                <th>2000Hz</th>
                <td>{formData.audiometry_results?.freq_2000 || '-'}</td>
              </tr>
              <tr>
                <th>3000Hz</th>
                <td>{formData.audiometry_results?.freq_3000 || '-'}</td>
                <th>4000Hz</th>
                <td>{formData.audiometry_results?.freq_4000 || '-'}</td>
                <th>6000Hz</th>
                <td>{formData.audiometry_results?.freq_6000 || '-'}</td>
              </tr>
              <tr>
                <th>تفسیر</th>
                <td colSpan={5}>{formData.audiometry_interpretation || '-'}</td>
              </tr>
            </tbody>
          </table>

          <h3>اسپیرومتری</h3>
          <table>
            <tbody>
              <tr>
                <th>FEV1</th>
                <td>{formData.spirometry_results?.fev1 || '-'}</td>
                <th>FEV1%</th>
                <td>{formData.spirometry_results?.fev1_percent || '-'}</td>
                <th>FVC</th>
                <td>{formData.spirometry_results?.fvc || '-'}</td>
              </tr>
              <tr>
                <th>FVC%</th>
                <td>{formData.spirometry_results?.fvc_percent || '-'}</td>
                <th>FEV1/FVC</th>
                <td>{formData.spirometry_results?.fev1_fvc_ratio || '-'}</td>
                <th>PEF</th>
                <td>{formData.spirometry_results?.pef || '-'}</td>
              </tr>
              <tr>
                <th>تفسیر</th>
                <td colSpan={5}>{formData.spirometry_interpretation || '-'}</td>
              </tr>
            </tbody>
          </table>

          <h3>تصویربرداری</h3>
          <table>
            <tbody>
              <tr>
                <th>یافته‌های CXR</th>
                <td>{formData.cxr_findings || '-'}</td>
              </tr>
              <tr>
                <th>یافته‌های ECG</th>
                <td>{formData.ecg_findings || '-'}</td>
              </tr>
              <tr>
                <th>سایر تصویربرداری</th>
                <td>{formData.other_imaging || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="page-break"></div>

        {/* Section 8: Final Opinion */}
        <div className="no-break">
          <h2>۸- نظریه نهایی پزشک</h2>
          <table>
            <tbody>
              <tr>
                <th>نام پزشک معاینه‌کننده</th>
                <td>{formData.examiner_name || '-'}</td>
                <th>کد نظام طب کار</th>
                <td>{formData.occupational_health_code || '-'}</td>
              </tr>
              <tr>
                <th>وضعیت صلاحیت</th>
                <td colSpan={3}>
                  <strong style={{ fontSize: '12pt' }}>
                    {formData.fitness_status === 'مناسب' ? '✓ مناسب برای کار' : 
                     formData.fitness_status === 'نامناسب' ? '✗ نامناسب برای کار' :
                     formData.fitness_status === 'مشروط' ? '⚠ مناسب با شرط' : formData.fitness_status}
                  </strong>
                </td>
              </tr>
              {formData.fitness_status === 'مشروط' && (
                <tr>
                  <th>شرایط</th>
                  <td colSpan={3}>{formData.fitness_conditions || '-'}</td>
                </tr>
              )}
              {formData.fitness_status === 'نامناسب' && (
                <tr>
                  <th>دلایل عدم صلاحیت</th>
                  <td colSpan={3}>{formData.unfitness_reasons || '-'}</td>
                </tr>
              )}
              <tr>
                <th>توصیه‌های پزشکی</th>
                <td colSpan={3}>{formData.medical_recommendations || '-'}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'center', width: '40%' }}>
              <div style={{ borderTop: '1px solid #333', marginTop: '60px', paddingTop: '8px' }}>
                امضا و مهر پزشک
              </div>
            </div>
            <div style={{ textAlign: 'center', width: '40%' }}>
              <div style={{ borderTop: '1px solid #333', marginTop: '60px', paddingTop: '8px' }}>
                تاریخ
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

OccupationalHealthPrintView.displayName = 'OccupationalHealthPrintView';

export default OccupationalHealthPrintView;
