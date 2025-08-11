export interface City {
  id: number;
  value: string;
  label: string;
  latitude: number;
  longitude: number;
}

export type SearchEntity = {
  id: number;
  type: "DOCTOR" | "SPECIALITY" | "CLINIC";
  value: string;
  label: string;
  imgUrl: string;
};
