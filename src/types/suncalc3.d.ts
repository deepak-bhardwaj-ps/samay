declare module "suncalc3" {
  interface SunTimeDef {
    name: string;
    value: Date;
    ts: number;
    pos: number;
    elevation?: number;
    julian: number;
    valid: boolean;
    deprecated?: boolean;
    nameOrg?: string;
    posOrg?: number;
  }

  interface SunTimes {
    solarNoon: SunTimeDef;
    nadir: SunTimeDef;
    goldenHourDawnStart: SunTimeDef;
    goldenHourDawnEnd: SunTimeDef;
    goldenHourDuskStart: SunTimeDef;
    goldenHourDuskEnd: SunTimeDef;
    sunriseStart: SunTimeDef;
    sunriseEnd: SunTimeDef;
    sunsetStart: SunTimeDef;
    sunsetEnd: SunTimeDef;
    blueHourDawnStart: SunTimeDef;
    blueHourDawnEnd: SunTimeDef;
    blueHourDuskStart: SunTimeDef;
    blueHourDuskEnd: SunTimeDef;
    civilDawn: SunTimeDef;
    civilDusk: SunTimeDef;
    nauticalDawn: SunTimeDef;
    nauticalDusk: SunTimeDef;
    amateurDawn: SunTimeDef;
    amateurDusk: SunTimeDef;
    astronomicalDawn: SunTimeDef;
    astronomicalDusk: SunTimeDef;
    dawn?: SunTimeDef;
    dusk?: SunTimeDef;
    nightEnd?: SunTimeDef;
    night?: SunTimeDef;
    nightStart?: SunTimeDef;
    goldenHour?: SunTimeDef;
    sunset?: SunTimeDef;
    sunrise?: SunTimeDef;
    goldenHourEnd?: SunTimeDef;
    goldenHourStart?: SunTimeDef;
  }

  interface SunCalcInstance {
    getSunTimes: (
      dateValue: Date,
      lat: number,
      lng: number,
      height?: number,
      addDeprecated?: boolean,
      inUTC?: boolean,
    ) => SunTimes;
    getPosition: (
      dateValue: Date,
      lat: number,
      lng: number,
    ) => {
      azimuth: number;
      altitude: number;
    };
  }

  const SunCalc: SunCalcInstance;
  export default SunCalc;
}
