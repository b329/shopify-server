export const LocationQueries = {
    GetLocations: `
  SELECT
    id,
      region,
      location,
      fee,
    (case when t.isActive is not null
      then 'true'
      else 'false'
    end) as 'isActive'
  FROM locations_system.locations as t
  WHERE
      isActive = true
  `,

    GetLocationsById: `
  SELECT
    id,
    region,
    location,
    fee,
    (case when t.isActive is not null
      then 'true'
      else 'false'
    end) as 'isActive'
  FROM locations_system.locations as t
  WHERE
    id = ?
  `,

    AddLocation: `
  INSERT INTO locations_system.locations (region, location, fee, isActive)
    VALUES (?, ?, true);
  `,

    UpdateLocationById: `
  UPDATE locations_system.locations
  SET region = ?,
      location = ?,
      fee = ?
  WHERE
    id = ?
  `,

    DeleteLocationById: `
  UPDATE locations_system.locations
  SET isActive = false
  WHERE
    id = ?
  `
};