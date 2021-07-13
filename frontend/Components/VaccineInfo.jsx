// @flow
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DataGrid from './VaccineInfo/DataGrid';
import { getAvailability } from '../Types/Hospital';
import { CITY_LIST } from '../Types/Location';

import type { Hospital } from '../Types/Hospital';
import type { Location } from '../Types/Location';
import type { VaccineType } from '../Types/VaccineType';

export default function VaccineInfo(
  props: { rows: Array<Hospital>, vaccineType: VaccineType },
): React.Node {
  const { rows, vaccineType } = props;
  const { t } = useTranslation('dataGrid');
  const [tNav] = useTranslation('nav');

  const availableHospitals = rows.filter((row) => getAvailability(row, vaccineType) === 'Available');
  const unavailableHospitals = rows.filter((row) => getAvailability(row, vaccineType) === 'Unavailable');
  const noDataHospitals = rows.filter((row) => getAvailability(row, vaccineType) === 'No data');

  const [selectedLocation, setLocation] = React.useState('臺北市');
  const [selectedCounty, setCounty] = React.useState('全部地區');

  if (rows.length === 0) {
    return (
      <div>獲取資料中...</div>
    );
  }

  const countyByCity = rows.reduce((byCity: { [Location]: string[] }, hospital) => {
    if (hospital.location in byCity) {
      if (byCity[hospital.location].indexOf(hospital.county) === -1) {
        byCity[hospital.location].push(hospital.county);
      }
      return byCity;
    }
    const newLocation = {};
    newLocation[hospital.location] = [hospital.county];
    return { ...byCity, ...newLocation };
  }, {});
  function changeLocations(event) {
    setLocation(event.target.value);
    setCounty('全部地區');
  }
  function changeCounty(event) {
    setCounty(event.target.value);
  }

  return (
    <div>
      <div style={{ height: '80vh' }} className="d-flex justify-content-center align-items-center text-center">
        <div className="flex-fill">
          <h3 className="mb-4">💉</h3>
          <h1>{tNav('txt-title')}</h1>
          <p>1922 以外的預約方式整理</p>
          <p>Vaccination sites & where to make reservations</p>
          <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#InfoModal">資訊陸續更新中！</button>
          <div className="mt-5">
            <h3>選擇施打點所在縣市</h3>
            <p>請問您想搜尋哪一個縣市的施打點？</p>
            <div className="row justify-content-center">
              <div className="col-md-4 mb-2">
                <select name="locations" className="form-select" onChange={changeLocations} value={selectedLocation}>
                  {
                    Object.keys(CITY_LIST).map((location) => (
                      <option value={location}>{location}</option>
                    ))
                  }
                </select>
              </div>
              <div className="col-md-4 mb-2">
                <select name="county" className="form-select" onChange={changeCounty} value={selectedCounty}>
                  <option value="全部地區">全部地區</option>
                  {
                    countyByCity[selectedLocation].map(
                      (county) => (
                        <option value={county}>{county}</option>
                      ),
                    )
                  }
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <DataGrid
          selectedLocation={selectedLocation}
          selectedCounty={selectedCounty}
          hospitals={availableHospitals}
          buttonText={t('btn-getAppointment')}
          vaccineType={vaccineType}
        />
        <DataGrid
          selectedLocation={selectedLocation}
          selectedCounty={selectedCounty}
          hospitals={noDataHospitals}
          buttonText={t('btn-visitWebsite')}
          vaccineType={vaccineType}
        />
        <DataGrid
          selectedLocation={selectedLocation}
          selectedCounty={selectedCounty}
          hospitals={unavailableHospitals}
          buttonText={t('btn-visitWebsite')}
          vaccineType={vaccineType}
        />
      </div>
      <div className="text-center my-5 pt-5">
        <h1>😷</h1>
        <p>
          以上就是所有您所要求的疫苗預約資訊，
          <br />
          出去要記得配戴口罩喔！
        </p>
      </div>
    </div>
  );
}
