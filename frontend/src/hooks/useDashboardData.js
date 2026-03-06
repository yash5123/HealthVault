import { useMemo } from "react";

export default function useDashboardData(medicines = [], checkups = []) {

  const stats = useMemo(() => {

    const total = medicines.length;

    const healthy = medicines.filter(m => m.quantity > 10).length;

    const low = medicines.filter(m => m.quantity > 0 && m.quantity <= 10).length;

    const critical = medicines.filter(m => m.quantity === 0).length;

    return {

      total,
      healthy,
      low,
      critical

    };

  }, [medicines]);

  const upcomingCheckups = useMemo(() => {

    const today = new Date();

    return checkups.filter(c => {

      const d = new Date(c.date);

      return d >= today;

    });

  }, [checkups]);

  return {

    stats,
    upcomingCheckups

  };

}