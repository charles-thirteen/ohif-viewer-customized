import { downloadBlob } from './downloadBlob';
import { DicomMetadataStore } from '../services/DicomMetadataStore/DicomMetadataStore';
import formatPN from './formatPN';

export default function downloadJSONReport(measurementData) {
  if (measurementData.length === 0) {
    return;
  }

  const measurements = measurementData.map(measurement => {
    const { referenceStudyUID, referenceSeriesUID, getReport, uid } = measurement;

    const seriesMetadata = DicomMetadataStore.getSeries(referenceStudyUID, referenceSeriesUID);
    const firstInstance = seriesMetadata?.instances?.[0];

    const entry = {
      uid,
      PatientID: firstInstance?.PatientID || '',
      PatientName: formatPN(firstInstance?.PatientName) || '',
      StudyInstanceUID: referenceStudyUID,
      SeriesInstanceUID: referenceSeriesUID,
      SOPInstanceUID: measurement.SOPInstanceUID || '',
      label: measurement.label || '',
      toolName: measurement.toolName || '',
    };

    if (getReport) {
      const report = getReport(measurement);
      report.columns.forEach((column, index) => {
        entry[column] = report.values[index];
      });
    }

    if (measurement.points) {
      entry.points = measurement.points;
    }

    return entry;
  });

  const json = JSON.stringify(measurements, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  downloadBlob(blob, { filename: 'MeasurementReport.json' });
}
