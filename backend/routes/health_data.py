from flask import Blueprint, jsonify, request
from services.eeg_ecg_conversion import convert_ecg_to_eeg
from services.anomaly_detection import detect_anomalies

health_data_bp = Blueprint('health_data', __name__)

@health_data_bp.route('/ecg', methods=['GET'])
def get_ecg_data():
    """
    Get ECG data for a specified time range
    Query parameters:
    - startTime: timestamp in milliseconds
    - endTime: timestamp in milliseconds
    """
    start_time = request.args.get('startTime', type=int)
    end_time = request.args.get('endTime', type=int)
    
    # In a real application, this would fetch data from a database
    # For now, we'll generate mock data
    from utils.signal_processing import generate_mock_ecg_data
    
    ecg_data = generate_mock_ecg_data(start_time, end_time)
    
    return jsonify(ecg_data)

@health_data_bp.route('/eeg', methods=['GET'])
def get_eeg_data():
    """
    Get EEG data for a specified time range
    Query parameters:
    - startTime: timestamp in milliseconds
    - endTime: timestamp in milliseconds
    """
    start_time = request.args.get('startTime', type=int)
    end_time = request.args.get('endTime', type=int)
    
    # In a real application, this would fetch data from a database
    # For now, we'll generate mock data and then convert from ECG
    from utils.signal_processing import generate_mock_ecg_data
    
    ecg_data = generate_mock_ecg_data(start_time, end_time)
    
    # Convert ECG to EEG using our transformation model
    eeg_data = []
    for ecg_point in ecg_data:
        eeg_values = convert_ecg_to_eeg(ecg_point['value'])
        eeg_data.append({
            'timestamp': ecg_point['timestamp'],
            **eeg_values
        })
    
    return jsonify(eeg_data)

@health_data_bp.route('/anomalies', methods=['GET'])
def get_anomalies():
    """
    Get detected anomalies for a specified time range
    Query parameters:
    - startTime: timestamp in milliseconds
    - endTime: timestamp in milliseconds
    """
    start_time = request.args.get('startTime', type=int)
    end_time = request.args.get('endTime', type=int)
    
    # In a real application, this would fetch ECG and EEG data and run anomaly detection
    # For now, we'll generate mock data
    from utils.signal_processing import generate_mock_ecg_data
    
    ecg_data = generate_mock_ecg_data(start_time, end_time)
    
    # Convert ECG to EEG
    eeg_data = []
    for ecg_point in ecg_data:
        eeg_values = convert_ecg_to_eeg(ecg_point['value'])
        eeg_data.append({
            'timestamp': ecg_point['timestamp'],
            **eeg_values
        })
    
    # Detect anomalies
    anomalies = detect_anomalies(ecg_data, eeg_data)
    
    return jsonify(anomalies)

@health_data_bp.route('/ecg/anomalies', methods=['GET'])
def get_ecg_anomalies():
    """
    Get ECG-specific anomalies for a specified time range
    Query parameters:
    - startTime: timestamp in milliseconds
    - endTime: timestamp in milliseconds
    """
    start_time = request.args.get('startTime', type=int)
    end_time = request.args.get('endTime', type=int)
    
    # In a real application, this would fetch ECG data and run anomaly detection
    # For now, we'll generate mock data
    from utils.signal_processing import generate_mock_ecg_data
    
    ecg_data = generate_mock_ecg_data(start_time, end_time)
    
    # Detect ECG anomalies
    anomalies = detect_anomalies(ecg_data, None, type='ECG')
    
    return jsonify(anomalies)

@health_data_bp.route('/eeg/anomalies', methods=['GET'])
def get_eeg_anomalies():
    """
    Get EEG-specific anomalies for a specified time range
    Query parameters:
    - startTime: timestamp in milliseconds
    - endTime: timestamp in milliseconds
    """
    start_time = request.args.get('startTime', type=int)
    end_time = request.args.get('endTime', type=int)
    
    # In a real application, this would fetch EEG data and run anomaly detection
    # For now, we'll generate mock ECG data and convert to EEG
    from utils.signal_processing import generate_mock_ecg_data
    
    ecg_data = generate_mock_ecg_data(start_time, end_time)
    
    # Convert ECG to EEG
    eeg_data = []
    for ecg_point in ecg_data:
        eeg_values = convert_ecg_to_eeg(ecg_point['value'])
        eeg_data.append({
            'timestamp': ecg_point['timestamp'],
            **eeg_values
        })
    
    # Detect EEG anomalies
    anomalies = detect_anomalies(None, eeg_data, type='EEG')
    
    return jsonify(anomalies)