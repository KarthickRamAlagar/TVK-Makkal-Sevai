// src/hooks/useRegistryRebuild.js

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rebuildDistrictRegistryFromProofs } from "../utils/statAggregation";
import { setDistrictRegistry } from "../redux/districtRegistrySlice";

export const useRegistryRebuild = () => {
  const dispatch = useDispatch();
  const proofRegistry = useSelector((state) => state.proofRegistry);

  useEffect(() => {
    const rebuilt = rebuildDistrictRegistryFromProofs(proofRegistry);
    dispatch(setDistrictRegistry(rebuilt));
    console.log("🛠️ Rebuilt and injected districtRegistry:", rebuilt);
  }, [dispatch, proofRegistry]);
};
