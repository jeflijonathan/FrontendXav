import type { AcademicCalendarModel, DayCellModel } from "@api/academicCalendar/model";

export const generateMonthCells = (year: number, month: number): Record<string, DayCellModel> => {
  const numDays = new Date(year, month, 0).getDate();
  const cells: Record<string, DayCellModel> = {};

  for (let d = 1; d <= 31; d++) {
    const key = String(d);
    if (d > numDays) {
      // Tanggal tidak ada (misal Feb 29-31, Apr 31) -> dinonaktifkan / hitam
      cells[key] = {
        day: d,
        valid: false,
        label: "",
        type: "disabled",
        bg_color: "#18181b", // dark disabled
        is_effective: false,
        note: "Tanggal tidak ada",
      };
    } else {
      const curDate = new Date(year, month - 1, d);
      const weekday = curDate.getDay(); // 0 = Sunday, 6 = Saturday

      if (weekday === 6) {
        // Sabtu (5 hari belajar -> Sabtu Libur "S")
        cells[key] = {
          day: d,
          valid: true,
          label: "S",
          type: "weekend_saturday",
          bg_color: "#fef08a", // soft yellow
          text_color: "#854d0e",
          is_effective: false,
          note: "Libur Akhir Pekan (Sabtu)",
        };
      } else if (weekday === 0) {
        // Minggu ("M")
        cells[key] = {
          day: d,
          valid: true,
          label: "M",
          type: "weekend_sunday",
          bg_color: "#fca5a5", // soft red
          text_color: "#991b1b",
          is_effective: false,
          note: "Libur Akhir Pekan (Minggu)",
        };
      } else {
        // Hari kerja / belajar efektif standar
        cells[key] = {
          day: d,
          valid: true,
          label: "",
          type: "effective_day",
          bg_color: "",
          is_effective: true,
          note: "Hari Efektif Belajar",
        };
      }
    }
  }

  return cells;
};

export const getDefaultAcademicCalendar = (): AcademicCalendarModel => {
  // 1. SEMESTER GANJIL
  // Juli 2026
  const juli = generateMonthCells(2026, 7);
  [1, 2, 3, 4, 5].forEach((d) => {
    juli[String(d)] = {
      ...juli[String(d)],
      label: "TP 2026 - 2027",
      type: "holiday_tp",
      bg_color: "#ef4444",
      text_color: "#ffffff",
      is_effective: false,
      note: "Libur Akhir TP 2025/2026",
    };
  });
  [6, 7, 8, 9, 10].forEach((d) => {
    juli[String(d)] = {
      ...juli[String(d)],
      label: "MPLS",
      type: "event_mpls",
      bg_color: "#fef08a",
      text_color: "#854d0e",
      is_effective: false,
      note: "Masa Pengenalan Lingkungan Sekolah",
    };
  });
  juli["13"] = {
    ...juli["13"],
    label: "1",
    type: "first_day",
    bg_color: "#86efac",
    text_color: "#14532d",
    is_effective: true,
    note: "Hari Pertama Masuk Semester Gasal",
  };
  juli["31"] = {
    ...juli["31"],
    label: "Misa",
    type: "event_misa",
    bg_color: "#e0e7ff",
    text_color: "#3730a3",
    is_effective: true,
    note: "Misa Pembukaan Tahun Pelajaran",
  };

  // Agustus 2026
  const agustus = generateMonthCells(2026, 8);
  [13, 14, 15].forEach((d) => {
    agustus[String(d)] = {
      ...agustus[String(d)],
      label: "Lomba",
      type: "event_lomba",
      bg_color: "#fed7aa",
      text_color: "#9a3412",
      is_effective: true,
      note: "Lomba HUT RI & Sekolah",
    };
  });
  agustus["17"] = {
    ...agustus["17"],
    label: "HUT RI",
    type: "holiday_national",
    bg_color: "#ef4444",
    text_color: "#ffffff",
    is_effective: false,
    note: "Hari Kemerdekaan RI Ke-81",
  };
  agustus["25"] = {
    ...agustus["25"],
    label: "Maulid",
    type: "holiday_national",
    bg_color: "#ef4444",
    text_color: "#ffffff",
    is_effective: false,
    note: "Maulid Nabi Muhammad SAW",
  };

  // September 2026
  const september = generateMonthCells(2026, 9);
  september["19"] = {
    ...september["19"],
    label: "Rapat",
    type: "event_rapat",
    bg_color: "#fed7aa",
    text_color: "#9a3412",
    is_effective: false,
    note: "Rapat Orang Tua Murid / Pleno",
  };

  // Oktober 2026
  const oktober = generateMonthCells(2026, 10);
  oktober["2"] = {
    ...oktober["2"],
    label: "R-MD",
    type: "event_rmd",
    bg_color: "#fed7aa",
    text_color: "#9a3412",
    is_effective: true,
    note: "Raport Mid Semester Gasal",
  };
  [7, 8, 9].forEach((d) => {
    oktober[String(d)] = {
      ...oktober[String(d)],
      label: "XAVOS IV",
      type: "event_xavos",
      bg_color: "#bfdbfe",
      text_color: "#1e3a8a",
      is_effective: true,
      note: "Xaverius Olympic & Science (XAVOS IV)",
    };
  });
  [14, 15, 16].forEach((d) => {
    oktober[String(d)] = {
      ...oktober[String(d)],
      label: "USKUP CUP",
      type: "event_uskup",
      bg_color: "#bfdbfe",
      text_color: "#1e3a8a",
      is_effective: true,
      note: "Kejuaraan Olahraga Uskup Cup",
    };
  });
  oktober["19"] = {
    ...oktober["19"],
    label: "Rapat",
    type: "event_rapat",
    bg_color: "#fed7aa",
    text_color: "#9a3412",
    is_effective: true,
    note: "Rapat Evaluasi Dewan Guru",
  };
  [20, 21, 22].forEach((d) => {
    oktober[String(d)] = {
      ...oktober[String(d)],
      label: "Praktek",
      type: "event_praktek",
      bg_color: "#fef08a",
      text_color: "#854d0e",
      is_effective: true,
      note: "Praktek Kejuruan",
    };
  });
  [27, 28, 29, 30].forEach((d) => {
    oktober[String(d)] = {
      ...oktober[String(d)],
      label: "UKK",
      type: "event_ukk",
      bg_color: "#fef08a",
      text_color: "#854d0e",
      is_effective: true,
      note: "Uji Kompetensi Keahlian (UKK)",
    };
  });

  // November 2026
  const november = generateMonthCells(2026, 11);
  [2, 3, 4, 5, 6].forEach((d) => {
    november[String(d)] = {
      ...november[String(d)],
      label: "PH-TKA",
      type: "event_tka",
      bg_color: "#fef08a",
      text_color: "#854d0e",
      is_effective: true,
      note: "Penilaian Harian / TKA",
    };
  });
  [11, 12, 13, 16, 17].forEach((d) => {
    november[String(d)] = {
      ...november[String(d)],
      label: "PSP",
      type: "event_psp",
      bg_color: "#fef08a",
      text_color: "#854d0e",
      is_effective: true,
      note: "Penilaian Sumatif Projek (PSP)",
    };
  });
  november["24"] = {
    ...november["24"],
    label: "Muhasabah",
    type: "event_muhasabah",
    bg_color: "#fed7aa",
    text_color: "#9a3412",
    is_effective: true,
    note: "Kegiatan Rohani",
  };
  [25, 26, 27, 30].forEach((d) => {
    november[String(d)] = {
      ...november[String(d)],
      label: "SAS-G",
      type: "event_sas",
      bg_color: "#fed7aa",
      text_color: "#9a3412",
      is_effective: true,
      note: "Sumatif Akhir Semester Gasal",
    };
  });

  // Desember 2026
  const desember = generateMonthCells(2026, 12);
  [1, 2, 3].forEach((d) => {
    desember[String(d)] = {
      ...desember[String(d)],
      label: "SAS-G",
      type: "event_sas",
      bg_color: "#fed7aa",
      text_color: "#9a3412",
      is_effective: true,
      note: "Sumatif Akhir Semester Gasal",
    };
  });
  desember["3"] = {
    ...desember["3"],
    label: "Pelindung YXP",
    type: "event_yxp",
    bg_color: "#fbcfe8",
    text_color: "#831843",
    is_effective: true,
    note: "Hari Pelindung YXP (St. Fransiskus Xaverius)",
  };
  desember["7"] = {
    ...desember["7"],
    label: "Susulan",
    type: "event_susulan",
    bg_color: "#fed7aa",
    text_color: "#9a3412",
    is_effective: true,
    note: "Ujian Susulan SAS-G",
  };
  [8, 9].forEach((d) => {
    desember[String(d)] = {
      ...desember[String(d)],
      label: "Olah Nilai",
      type: "event_nilai",
      bg_color: "#fed7aa",
      text_color: "#9a3412",
      is_effective: true,
      note: "Pengolahan Nilai Raport",
    };
  });
  desember["14"] = {
    ...desember["14"],
    label: "I-Nilai",
    type: "event_inilai",
    bg_color: "#fed7aa",
    text_color: "#9a3412",
    is_effective: true,
    note: "Input Nilai E-Raport",
  };
  desember["15"] = {
    ...desember["15"],
    label: "Legger",
    type: "event_legger",
    bg_color: "#fed7aa",
    text_color: "#9a3412",
    is_effective: true,
    note: "Pencetakan Legger Nilai",
  };
  desember["16"] = {
    ...desember["16"],
    label: "Cetak-R",
    type: "event_cetak",
    bg_color: "#fed7aa",
    text_color: "#9a3412",
    is_effective: true,
    note: "Pencetakan Raport",
  };
  desember["18"] = {
    ...desember["18"],
    label: "R-1",
    type: "event_raport",
    bg_color: "#fbcfe8",
    text_color: "#831843",
    is_effective: true,
    note: "Pembagian Raport Semester Gasal (R-1)",
  };
  for (let d = 19; d <= 31; d++) {
    if (d === 20 || d === 27) continue; // Sunday already marked M
    desember[String(d)] = {
      ...desember[String(d)],
      label: "Libur Nataru",
      type: "holiday_nataru",
      bg_color: "#fef08a",
      text_color: "#854d0e",
      is_effective: false,
      note: "Libur Natal & Tahun Baru",
    };
  }

  // 2. SEMESTER GENAP
  // Januari 2027
  const januari = generateMonthCells(2027, 1);
  [1, 2, 3].forEach((d) => {
    januari[String(d)] = {
      ...januari[String(d)],
      label: "Libur Nataru",
      type: "holiday_nataru",
      bg_color: "#fef08a",
      text_color: "#854d0e",
      is_effective: false,
      note: "Libur Natal & Tahun Baru",
    };
  });
  januari["4"] = {
    ...januari["4"],
    label: "1",
    type: "first_day",
    bg_color: "#86efac",
    text_color: "#14532d",
    is_effective: true,
    note: "Hari Pertama Masuk Semester Genap",
  };
  januari["5"] = {
    ...januari["5"],
    label: "Isra Mi'raj",
    type: "holiday_national",
    bg_color: "#ef4444",
    text_color: "#ffffff",
    is_effective: false,
    note: "Libur Isra Mi'raj Nabi Muhammad SAW",
  };

  // Februari 2027
  const februari = generateMonthCells(2027, 2);
  februari["6"] = {
    ...februari["6"],
    label: "Imlek",
    type: "holiday_national",
    bg_color: "#ef4444",
    text_color: "#ffffff",
    is_effective: false,
    note: "Tahun Baru Imlek 2578 Kongzili",
  };
  februari["8"] = {
    ...februari["8"],
    label: "Awal Puasa",
    type: "holiday_event",
    bg_color: "#fed7aa",
    text_color: "#9a3412",
    is_effective: false,
    note: "Libur Awal Puasa",
  };
  februari["10"] = {
    ...februari["10"],
    label: "Rabu Abu",
    type: "holiday_event",
    bg_color: "#fed7aa",
    text_color: "#9a3412",
    is_effective: false,
    note: "Rabu Abu",
  };

  // Maret 2027
  const maret = generateMonthCells(2027, 3);
  maret["9"] = {
    ...maret["9"],
    label: "Nyepi",
    type: "holiday_national",
    bg_color: "#ef4444",
    text_color: "#ffffff",
    is_effective: false,
    note: "Hari Raya Nyepi Tahun Baru Saka 1949",
  };
  [10, 11].forEach((d) => {
    maret[String(d)] = {
      ...maret[String(d)],
      label: "Idul Fitri",
      type: "holiday_national",
      bg_color: "#ef4444",
      text_color: "#ffffff",
      is_effective: false,
      note: "Hari Raya Idul Fitri 1448 H",
    };
  });
  [15, 16].forEach((d) => {
    maret[String(d)] = {
      ...maret[String(d)],
      label: "Cuti Bersama",
      type: "holiday_cuti",
      bg_color: "#fed7aa",
      text_color: "#9a3412",
      is_effective: false,
      note: "Libur Cuti Bersama Idul Fitri",
    };
  });
  maret["21"] = {
    ...maret["21"],
    label: "Minggu Palma",
    type: "event_church",
    bg_color: "#fca5a5",
    text_color: "#991b1b",
    is_effective: false,
    note: "Minggu Palma",
  };
  maret["26"] = {
    ...maret["26"],
    label: "Jumat Agung",
    type: "holiday_national",
    bg_color: "#ef4444",
    text_color: "#ffffff",
    is_effective: false,
    note: "Wafat Yesus Kristus (Jumat Agung)",
  };
  [24, 25, 27, 29].forEach((d) => {
    maret[String(d)] = {
      ...maret[String(d)],
      label: "Libur Paskah",
      type: "holiday_paskah",
      bg_color: "#fed7aa",
      text_color: "#9a3412",
      is_effective: false,
      note: "Libur Paskah",
    };
  });

  // April 2027
  const april = generateMonthCells(2027, 4);

  // Mei 2027
  const mei = generateMonthCells(2027, 5);
  mei["1"] = {
    ...mei["1"],
    label: "Hari Buruh",
    type: "holiday_national",
    bg_color: "#ef4444",
    text_color: "#ffffff",
    is_effective: false,
    note: "Hari Buruh Internasional",
  };
  mei["5"] = {
    ...mei["5"],
    label: "HUT YXP",
    type: "event_yxp",
    bg_color: "#fed7aa",
    text_color: "#9a3412",
    is_effective: true,
    note: "Hari Ulang Tahun YXP Ke-97",
  };
  mei["6"] = {
    ...mei["6"],
    label: "Kenaikan",
    type: "holiday_national",
    bg_color: "#ef4444",
    text_color: "#ffffff",
    is_effective: false,
    note: "Kenaikan Yesus Kristus",
  };
  mei["17"] = {
    ...mei["17"],
    label: "Idul Adha",
    type: "holiday_national",
    bg_color: "#ef4444",
    text_color: "#ffffff",
    is_effective: false,
    note: "Hari Raya Idul Adha 1448 H",
  };
  mei["20"] = {
    ...mei["20"],
    label: "Waisak",
    type: "holiday_national",
    bg_color: "#ef4444",
    text_color: "#ffffff",
    is_effective: false,
    note: "Hari Raya Waisak 2571",
  };
  [25, 26, 27, 28, 31].forEach((d) => {
    mei[String(d)] = {
      ...mei[String(d)],
      label: "SAS-G",
      type: "event_sas",
      bg_color: "#fed7aa",
      text_color: "#9a3412",
      is_effective: true,
      note: "Sumatif Akhir Semester Genap",
    };
  });

  // Juni 2027
  const juni = generateMonthCells(2027, 6);
  juni["1"] = {
    ...juni["1"],
    label: "Pancasila",
    type: "holiday_national",
    bg_color: "#ef4444",
    text_color: "#ffffff",
    is_effective: false,
    note: "Hari Lahir Pancasila",
  };
  juni["6"] = {
    ...juni["6"],
    label: "1 Muharram",
    type: "holiday_national",
    bg_color: "#ef4444",
    text_color: "#ffffff",
    is_effective: false,
    note: "Tahun Baru Islam 1449 H",
  };
  [2, 3, 4, 7].forEach((d) => {
    juni[String(d)] = {
      ...juni[String(d)],
      label: "SAS-G",
      type: "event_sas",
      bg_color: "#fed7aa",
      text_color: "#9a3412",
      is_effective: true,
      note: "SAS-G Genap",
    };
  });
  [8, 9].forEach((d) => {
    juni[String(d)] = {
      ...juni[String(d)],
      label: "Olah Nilai",
      type: "event_nilai",
      bg_color: "#fed7aa",
      text_color: "#9a3412",
      is_effective: true,
      note: "Pengolahan Nilai",
    };
  });
  juni["10"] = {
    ...juni["10"],
    label: "I-Nilai",
    type: "event_inilai",
    bg_color: "#fed7aa",
    text_color: "#9a3412",
    is_effective: true,
    note: "Input Nilai Raport",
  };
  juni["14"] = {
    ...juni["14"],
    label: "Legger",
    type: "event_legger",
    bg_color: "#fed7aa",
    text_color: "#9a3412",
    is_effective: true,
    note: "Pencetakan Legger",
  };
  juni["15"] = {
    ...juni["15"],
    label: "Cetak-R",
    type: "event_cetak",
    bg_color: "#fed7aa",
    text_color: "#9a3412",
    is_effective: true,
    note: "Cetak Raport",
  };
  juni["18"] = {
    ...juni["18"],
    label: "R-2",
    type: "event_raport",
    bg_color: "#fbcfe8",
    text_color: "#831843",
    is_effective: true,
    note: "Pembagian Raport Semester Genap (R-2)",
  };
  for (let d = 19; d <= 30; d++) {
    if (d === 20 || d === 27) continue;
    juni[String(d)] = {
      ...juni[String(d)],
      label: "Libur TP",
      type: "holiday_sem",
      bg_color: "#fed7aa",
      text_color: "#9a3412",
      is_effective: false,
      note: "Libur Akhir Tahun Pelajaran",
    };
  }

  // Juli 2027
  const juli27 = generateMonthCells(2027, 7);
  for (let d = 1; d <= 10; d++) {
    if (d === 4) continue;
    juli27[String(d)] = {
      ...juli27[String(d)],
      label: "Libur TP",
      type: "holiday_sem",
      bg_color: "#fed7aa",
      text_color: "#9a3412",
      is_effective: false,
      note: "Libur Akhir Tahun Pelajaran",
    };
  }
  juli27["12"] = {
    ...juli27["12"],
    label: "1",
    type: "first_day",
    bg_color: "#86efac",
    text_color: "#14532d",
    is_effective: false,
    note: "TP 2027-2028",
  };
  for (let d = 13; d <= 31; d++) {
    if (d === 17 || d === 18 || d === 24 || d === 25 || d === 31) continue;
    juli27[String(d)] = {
      ...juli27[String(d)],
      label: "TP 2027-2028",
      type: "holiday_tp",
      bg_color: "#ef4444",
      text_color: "#ffffff",
      is_effective: false,
      note: "Tahun Pelajaran Baru 2027/2028",
    };
  }

  return {
    academic_year: "2026/2027",
    title: "KALENDER AKADEMIK SMK XAVERIUS PALEMBANG TAHUN PELAJARAN 2026 - 2027",
    institution: "Yayasan Xaverius Palembang - SMK Xaverius Palembang",
    semesters: [
      {
        id: "ganjil",
        name: "Semester Ganjil",
        academic_year: "2026/2027",
        total_effective_weeks: 23,
        total_effective_days: 112,
        months: [
          { name: "Juli 2026", month_number: 7, year: 2026, effective_weeks: 3, effective_days: 15, cells: juli },
          { name: "Agustus 2026", month_number: 8, year: 2026, effective_weeks: 4, effective_days: 19, cells: agustus },
          { name: "September 2026", month_number: 9, year: 2026, effective_weeks: 5, effective_days: 22, cells: september },
          { name: "Oktober 2026", month_number: 10, year: 2026, effective_weeks: 4, effective_days: 22, cells: oktober },
          { name: "November 2026", month_number: 11, year: 2026, effective_weeks: 4, effective_days: 21, cells: november },
          { name: "Desember 2026", month_number: 12, year: 2026, effective_weeks: 3, effective_days: 13, cells: desember },
        ],
      },
      {
        id: "genap",
        name: "Semester Genap",
        academic_year: "2026/2027",
        total_effective_weeks: 22,
        total_effective_days: 100,
        months: [
          { name: "Januari 2027", month_number: 1, year: 2027, effective_weeks: 4, effective_days: 19, cells: januari },
          { name: "Februari 2027", month_number: 2, year: 2027, effective_weeks: 4, effective_days: 18, cells: februari },
          { name: "Maret 2027", month_number: 3, year: 2027, effective_weeks: 3, effective_days: 11, cells: maret },
          { name: "April 2027", month_number: 4, year: 2027, effective_weeks: 4, effective_days: 22, cells: april },
          { name: "Mei 2027", month_number: 5, year: 2027, effective_weeks: 4, effective_days: 18, cells: mei },
          { name: "Juni 2027", month_number: 6, year: 2027, effective_weeks: 3, effective_days: 12, cells: juni },
          { name: "Juli 2027", month_number: 7, year: 2027, effective_weeks: 0, effective_days: 0, cells: juli27 },
        ],
      },
    ],
    legends: [
      { code: "1", label: "Hari pertama masuk sekolah", date_range: "13 Juli 2026 / 4 Januari 2027", color: "#86efac" },
      { code: "MPLS", label: "Masa Pengenalan Lingkungan Sekolah", date_range: "6 - 10 Juli 2026", color: "#fef08a" },
      { code: "HUT RI", label: "Hari Kemerdekaan RI Ke-81", date_range: "17 Agustus 2026", color: "#ef4444" },
      { code: "Maulid", label: "Maulid Nabi Muhammad SAW", date_range: "25 Agustus 2026", color: "#ef4444" },
      { code: "XAVOS IV", label: "Xaverius Olympic & Science", date_range: "7 - 9 Oktober 2026", color: "#bfdbfe" },
      { code: "USKUP CUP", label: "Kejuaraan Olahraga Uskup Cup", date_range: "14 - 16 Oktober 2026", color: "#bfdbfe" },
      { code: "UKK", label: "Uji Kompetensi Keahlian", date_range: "27 - 30 Oktober 2026", color: "#fef08a" },
      { code: "SAS-G", label: "Sumatif Akhir Semester Gasal", date_range: "25 Nov - 3 Des 2026", color: "#fed7aa" },
      { code: "Pelindung YXP", label: "Hari Pelindung Yayasan Xaverius", date_range: "3 Desember 2026", color: "#fbcfe8" },
      { code: "R-1", label: "Pembagian Raport Semester Gasal", date_range: "18 Desember 2026", color: "#fbcfe8" },
      { code: "Libur Nataru", label: "Libur Natal & Tahun Baru", date_range: "19 Des 2026 - 3 Jan 2027", color: "#fef08a" },
      { code: "Isra Mi'raj", label: "Libur Isra Mi'raj", date_range: "5 Januari 2027", color: "#ef4444" },
      { code: "Imlek", label: "Tahun Baru Imlek 2578", date_range: "6 Februari 2027", color: "#ef4444" },
      { code: "Puasa & Abu", label: "Libur Awal Puasa & Rabu Abu", date_range: "8 & 10 Februari 2027", color: "#fed7aa" },
      { code: "Nyepi", label: "Hari Raya Nyepi 1949", date_range: "9 Maret 2027", color: "#ef4444" },
      { code: "Idul Fitri", label: "Hari Raya Idul Fitri 1448 H", date_range: "10 - 16 Maret 2027", color: "#ef4444" },
      { code: "Paskah", label: "Jumat Agung & Libur Paskah", date_range: "24 - 29 Maret 2027", color: "#fed7aa" },
      { code: "Hari Buruh", label: "Hari Buruh Internasional", date_range: "1 Mei 2027", color: "#ef4444" },
      { code: "HUT YXP", label: "Hari Ulang Tahun YXP Ke-97", date_range: "5 Mei 2027", color: "#fed7aa" },
      { code: "Kenaikan", label: "Kenaikan Yesus Kristus", date_range: "6 Mei 2027", color: "#ef4444" },
      { code: "Idul Adha", label: "Hari Raya Idul Adha 1448 H", date_range: "17 Mei 2027", color: "#ef4444" },
      { code: "Waisak", label: "Hari Raya Waisak 2571", date_range: "20 Mei 2027", color: "#ef4444" },
      { code: "Pancasila", label: "Hari Lahir Pancasila", date_range: "1 Juni 2027", color: "#ef4444" },
      { code: "1 Muharram", label: "Tahun Baru Islam 1449 H", date_range: "6 Juni 2027", color: "#ef4444" },
      { code: "R-2", label: "Pembagian Raport Semester Genap", date_range: "18 Juni 2027", color: "#fbcfe8" },
      { code: "Libur TP", label: "Libur Akhir Tahun Pelajaran", date_range: "19 Juni - 10 Juli 2027", color: "#fed7aa" },
    ],
    summary: {
      total_effective_weeks_yearly: 45,
      total_effective_days_yearly: 212,
      five_day_work_week: true,
    },
  };
};

