
CREATE TABLE IF NOT EXISTS vehicle_history (
  id BIGSERIAL PRIMARY KEY,
  vehicle_id VARCHAR(64) NOT NULL,
  soc DOUBLE PRECISION NOT NULL,
  kwh_delivered_dc DOUBLE PRECISION NOT NULL,
  battery_temp DOUBLE PRECISION NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL
);


CREATE TABLE IF NOT EXISTS vehicle_live (
  vehicle_id VARCHAR(64) PRIMARY KEY,
  soc DOUBLE PRECISION NOT NULL,
  kwh_delivered_dc DOUBLE PRECISION NOT NULL,
  battery_temp DOUBLE PRECISION NOT NULL,
  last_seen TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS meter_history (
  id BIGSERIAL PRIMARY KEY,
  meter_id VARCHAR(64) NOT NULL,
  kwh_consumed_ac DOUBLE PRECISION NOT NULL,
  voltage DOUBLE PRECISION NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL
);


CREATE TABLE IF NOT EXISTS meter_live (
  meter_id VARCHAR(64) PRIMARY KEY,
  kwh_consumed_ac DOUBLE PRECISION NOT NULL,
  voltage DOUBLE PRECISION NOT NULL,
  last_seen TIMESTAMPTZ NOT NULL
);


CREATE TABLE IF NOT EXISTS vehicle_meter_map (
  vehicle_id VARCHAR(64) PRIMARY KEY,
  meter_id VARCHAR(64) NOT NULL
);


CREATE INDEX IF NOT EXISTS idx_vehicle_history_vehicle_time
ON vehicle_history (vehicle_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_meter_history_meter_time
ON meter_history (meter_id, recorded_at DESC);
