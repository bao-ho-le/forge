import { supabase } from "./supabase";
import { invalidateCache } from "./dataCache";

export type PrimaryGym = {
  id: string;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  radius_meters: number;
};

export async function fetchPrimaryGym(userId: string): Promise<PrimaryGym | null> {
  const { data, error } = await supabase
    .from("gyms")
    .select("id, name, address, latitude, longitude, radius_meters")
    .eq("user_id", userId)
    .eq("is_primary", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export type SaveGymInput = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
};

export async function deletePrimaryGym(
  gymId: string,
): Promise<{ error: Error | null }> {
  const { error } = await supabase.from("gyms").delete().eq("id", gymId);

  if (error) return { error };

  invalidateCache();
  return { error: null };
}

export async function savePrimaryGym(
  userId: string,
  existingId: string | null,
  input: SaveGymInput,
): Promise<{ error: Error | null }> {
  const payload = {
    user_id: userId,
    is_primary: true,
    name: input.name,
    address: input.address,
    latitude: input.latitude,
    longitude: input.longitude,
    radius_meters: input.radiusMeters,
  };

  const { error } = existingId
    ? await supabase.from("gyms").update(payload).eq("id", existingId)
    : await supabase.from("gyms").insert(payload);

  if (error) return { error };

  invalidateCache();
  return { error: null };
}
