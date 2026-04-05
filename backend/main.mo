import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Int "mo:base/Int";
import Debug "mo:base/Debug";
import List "mo:base/List";
import Time "mo:base/Time";
import Array "mo:base/Array";

import Registry "blob-storage/registry";

actor PagosDuatLogistics {

  public type UserProfile = {
    name : Text;
    companyName : Text;
    salary : Int;
    currency : Text;
    language : Text;
    monthlyGoal : Int;
  };

  public type TripCategory = {
    id : Text;
    name : Text;
    defaultAmount : Int;
  };

  public type TripRecord = {
    id : Text;
    categoryId : Text;
    amount : Int;
    date : Int;
  };

  public type OtrosEntry = {
    id : Text;
    description : Text;
    amount : Int;
    date : Int;
    entryType : Text;
  };

  public type MonthlySummary = {
    userId : Text;
    month : Int;
    totalToReceive : Int;
    expenses : Int;
    netBalance : Int;
    timestamp : Int;
  };

  public type CategorySummary = {
    categoryId : Text;
    categoryName : Text;
    tripCount : Int;
    totalAmount : Int;
  };

  public type EntryTypeSummary = {
    entryType : Text;
    count : Int;
    totalAmount : Int;
  };

  public type MonthlyBreakdown = {
    categorySummaries : [CategorySummary];
    entryTypeSummaries : [EntryTypeSummary];
    totalTrips : Int;
    totalExtras : Int;
    totalExpenses : Int;
    netBalance : Int;
  };

  public type VisualSummary = {
    title : Text;
    subtitle : Text;
    totalToReceive : Int;
    expenses : Int;
    netBalance : Int;
    categories : [CategorySummary];
    entryTypes : [EntryTypeSummary];
    message : Text;
    imagePath : Text;
  };

  public type CategoryBreakdown = {
    categoryName : Text;
    tripCount : Int;
  };

  public type VisualSummaryWithBreakdown = {
    title : Text;
    subtitle : Text;
    totalToReceive : Int;
    expenses : Int;
    netBalance : Int;
    categories : [CategorySummary];
    entryTypes : [EntryTypeSummary];
    message : Text;
    imagePath : Text;
    categoryBreakdown : [CategoryBreakdown];
    categoryBreakdownText : Text;
  };

  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  transient let intMap = OrderedMap.Make<Int>(Int.compare);

  var userProfiles : OrderedMap.Map<Text, UserProfile> = textMap.empty<UserProfile>();
  var tripCategories : OrderedMap.Map<Text, TripCategory> = textMap.empty<TripCategory>();
  var tripRecords : OrderedMap.Map<Text, TripRecord> = textMap.empty<TripRecord>();
  var otrosEntries : OrderedMap.Map<Text, OtrosEntry> = textMap.empty<OtrosEntry>();
  var monthlySummaries : OrderedMap.Map<Int, MonthlySummary> = intMap.empty<MonthlySummary>();

  var positivePhrases : List.List<Text> = List.fromArray<Text>([
    "Este es mi resumen mensual",
    "Esto es lo que me toca percibir este mes",
    "Este mes me corresponde recibir",
    "Resumen de ingresos y gastos del mes",
    "Balance mensual de mi trabajo",
    "Esto es lo que he ganado este mes",
    "Mi resumen financiero mensual",
    "Resultados del mes en Duat Logistics",
    "Este mes la empresa me debe",
    "Logros financieros del mes",
  ]);

  let registry = Registry.new();

  public func createUserProfile(userId : Text, name : Text, companyName : Text, salary : Int, language : Text, monthlyGoal : Int) : async () {
    if (Text.size(name) == 0) {
      Debug.trap("El nombre no puede estar vacío");
    };
    if (Text.size(companyName) == 0) {
      Debug.trap("El nombre de la empresa no puede estar vacío");
    };
    if (salary < 0) {
      Debug.trap("El salario debe ser un número positivo");
    };
    if (monthlyGoal < 0) {
      Debug.trap("El objetivo mensual debe ser un número positivo");
    };

    let profile : UserProfile = {
      name;
      companyName;
      salary;
      currency = "€";
      language;
      monthlyGoal;
    };
    userProfiles := textMap.put(userProfiles, userId, profile);
  };

  public func getUserProfile(userId : Text) : async ?UserProfile {
    textMap.get(userProfiles, userId);
  };

  public func updateUserProfile(userId : Text, name : Text, companyName : Text, salary : Int, language : Text, monthlyGoal : Int) : async () {
    if (Text.size(name) == 0) {
      Debug.trap("El nombre no puede estar vacío");
    };
    if (Text.size(companyName) == 0) {
      Debug.trap("El nombre de la empresa no puede estar vacío");
    };
    if (salary < 0) {
      Debug.trap("El salario debe ser un número positivo");
    };
    if (monthlyGoal < 0) {
      Debug.trap("El objetivo mensual debe ser un número positivo");
    };

    switch (textMap.get(userProfiles, userId)) {
      case (null) { Debug.trap("Perfil de usuario no encontrado") };
      case (?profile) {
        let updatedProfile : UserProfile = {
          name;
          companyName;
          salary;
          currency = profile.currency;
          language;
          monthlyGoal;
        };
        userProfiles := textMap.put(userProfiles, userId, updatedProfile);
      };
    };
  };

  public func addTripCategory(userId : Text, name : Text, defaultAmount : Int) : async Text {
    let categoryId = userId # "_" # name;
    let category : TripCategory = {
      id = categoryId;
      name;
      defaultAmount;
    };
    tripCategories := textMap.put(tripCategories, categoryId, category);
    categoryId;
  };

  public func getTripCategories(userId : Text) : async [TripCategory] {
    Iter.toArray(
      Iter.filter(
        textMap.vals(tripCategories),
        func(cat : TripCategory) : Bool {
          Text.startsWith(cat.id, #text userId);
        },
      )
    );
  };

  public func updateTripCategory(categoryId : Text, name : Text, defaultAmount : Int) : async () {
    switch (textMap.get(tripCategories, categoryId)) {
      case (null) { Debug.trap("Categoría de viaje no encontrada") };
      case (?_) {
        let updatedCategory : TripCategory = {
          id = categoryId;
          name;
          defaultAmount;
        };
        tripCategories := textMap.put(tripCategories, categoryId, updatedCategory);
      };
    };
  };

  public func deleteTripCategory(categoryId : Text) : async () {
    tripCategories := textMap.delete(tripCategories, categoryId);
  };

  public func addTripRecord(userId : Text, categoryId : Text, amount : Int, date : Int) : async Text {
    let timestamp = Time.now();
    let recordId = userId # "_" # Int.toText(date) # "_" # Int.toText(timestamp);
    let record : TripRecord = {
      id = recordId;
      categoryId;
      amount;
      date;
    };
    tripRecords := textMap.put(tripRecords, recordId, record);
    recordId;
  };

  public func getTripRecords(userId : Text) : async [TripRecord] {
    Iter.toArray(
      Iter.filter(
        textMap.vals(tripRecords),
        func(record : TripRecord) : Bool {
          Text.startsWith(record.id, #text userId);
        },
      )
    );
  };

  public func updateTripRecord(recordId : Text, categoryId : Text, amount : Int, date : Int) : async () {
    switch (textMap.get(tripRecords, recordId)) {
      case (null) { Debug.trap("Registro de viaje no encontrado") };
      case (?_) {
        let updatedRecord : TripRecord = {
          id = recordId;
          categoryId;
          amount;
          date;
        };
        tripRecords := textMap.put(tripRecords, recordId, updatedRecord);
      };
    };
  };

  public func addOtrosEntry(userId : Text, description : Text, amount : Int, date : Int, entryType : Text) : async Text {
    let timestamp = Time.now();
    let entryId = userId # "_" # Int.toText(date) # "_" # Int.toText(timestamp);
    let entry : OtrosEntry = {
      id = entryId;
      description;
      amount;
      date;
      entryType;
    };
    otrosEntries := textMap.put(otrosEntries, entryId, entry);
    entryId;
  };

  public func getOtrosEntries(userId : Text) : async [OtrosEntry] {
    Iter.toArray(
      Iter.filter(
        textMap.vals(otrosEntries),
        func(entry : OtrosEntry) : Bool {
          Text.startsWith(entry.id, #text userId);
        },
      )
    );
  };

  public func updateOtrosEntry(entryId : Text, description : Text, amount : Int, date : Int, entryType : Text) : async () {
    switch (textMap.get(otrosEntries, entryId)) {
      case (null) { Debug.trap("Entrada no encontrada") };
      case (?_) {
        let updatedEntry : OtrosEntry = {
          id = entryId;
          description;
          amount;
          date;
          entryType;
        };
        otrosEntries := textMap.put(otrosEntries, entryId, updatedEntry);
      };
    };
  };

  public func deleteTripRecord(recordId : Text) : async () {
    tripRecords := textMap.delete(tripRecords, recordId);
  };

  public func deleteOtrosEntry(entryId : Text) : async () {
    otrosEntries := textMap.delete(otrosEntries, entryId);
  };

  public func saveMonthlySummary(userId : Text, month : Int, totalToReceive : Int, expenses : Int, netBalance : Int) : async () {
    let summaryId = month;
    let summary : MonthlySummary = {
      userId;
      month;
      totalToReceive;
      expenses;
      netBalance;
      timestamp = Time.now();
    };
    monthlySummaries := intMap.put(monthlySummaries, summaryId, summary);
  };

  public func getMonthlySummary(userId : Text, month : Int) : async ?MonthlySummary {
    switch (intMap.get(monthlySummaries, month)) {
      case (null) { null };
      case (?summary) {
        if (summary.userId == userId) {
          ?summary;
        } else {
          null;
        };
      };
    };
  };

  public func getRandomPositivePhrase() : async Text {
    let size = List.size(positivePhrases);
    if (size == 0) {
      "Este es mi resumen mensual";
    } else {
      let index = Int.abs(Time.now()) % size;
      switch (List.get(positivePhrases, index)) {
        case (null) { "Este es mi resumen mensual" };
        case (?phrase) { phrase };
      };
    };
  };

  public func addPositivePhrase(phrase : Text) : async () {
    positivePhrases := List.push(phrase, positivePhrases);
  };

  public func getAllPositivePhrases() : async [Text] {
    List.toArray(positivePhrases);
  };

  public func getMonthlyBreakdown(userId : Text, month : Int) : async MonthlyBreakdown {
    let monthStart = month * 1000000;
    let monthEnd = monthStart + 999999;

    let userTripRecords = Iter.toArray(
      Iter.filter(
        textMap.vals(tripRecords),
        func(record : TripRecord) : Bool {
          Text.startsWith(record.id, #text userId) and record.date >= monthStart and record.date <= monthEnd
        },
      )
    );

    let userOtrosEntries = Iter.toArray(
      Iter.filter(
        textMap.vals(otrosEntries),
        func(entry : OtrosEntry) : Bool {
          Text.startsWith(entry.id, #text userId) and entry.date >= monthStart and entry.date <= monthEnd
        },
      )
    );

    let userCategories = Iter.toArray(
      Iter.filter(
        textMap.vals(tripCategories),
        func(cat : TripCategory) : Bool {
          Text.startsWith(cat.id, #text userId);
        },
      )
    );

    let categorySummaries = Array.map<TripCategory, CategorySummary>(
      userCategories,
      func(cat : TripCategory) : CategorySummary {
        let trips = Array.filter<TripRecord>(
          userTripRecords,
          func(record : TripRecord) : Bool {
            record.categoryId == cat.id;
          },
        );
        let totalAmount = Array.foldLeft<TripRecord, Int>(
          trips,
          0,
          func(acc : Int, record : TripRecord) : Int {
            acc + record.amount;
          },
        );
        {
          categoryId = cat.id;
          categoryName = cat.name;
          tripCount = Array.size(trips);
          totalAmount;
        };
      },
    );

    let entryTypes = ["crédito", "deuda"];
    let entryTypeSummaries = Array.map<Text, EntryTypeSummary>(
      entryTypes,
      func(entryType : Text) : EntryTypeSummary {
        let entries = Array.filter<OtrosEntry>(
          userOtrosEntries,
          func(entry : OtrosEntry) : Bool {
            entry.entryType == entryType;
          },
        );
        let totalAmount = Array.foldLeft<OtrosEntry, Int>(
          entries,
          0,
          func(acc : Int, entry : OtrosEntry) : Int {
            acc + entry.amount;
          },
        );
        {
          entryType;
          count = Array.size(entries);
          totalAmount;
        };
      },
    );

    let totalTrips = Array.foldLeft<TripRecord, Int>(
      userTripRecords,
      0,
      func(acc : Int, record : TripRecord) : Int {
        acc + record.amount;
      },
    );

    let totalExtras = Array.foldLeft<OtrosEntry, Int>(
      userOtrosEntries,
      0,
      func(acc : Int, entry : OtrosEntry) : Int {
        if (entry.entryType == "crédito") {
          acc + entry.amount;
        } else {
          acc;
        };
      },
    );

    let totalExpenses = Array.foldLeft<OtrosEntry, Int>(
      userOtrosEntries,
      0,
      func(acc : Int, entry : OtrosEntry) : Int {
        if (entry.entryType == "deuda") {
          acc + entry.amount;
        } else {
          acc;
        };
      },
    );

    let netBalance = totalTrips + totalExtras - totalExpenses;

    {
      categorySummaries;
      entryTypeSummaries;
      totalTrips;
      totalExtras;
      totalExpenses;
      netBalance;
    };
  };

  public func generateVisualSummary(userId : Text, month : Int) : async VisualSummaryWithBreakdown {
    let defaultImagePath = "/images/default-summary.png";
    let defaultTitle = "Resumen Mensual";
    let defaultSubtitle = "Balance de ingresos y gastos";
    let defaultMessage = "Este es tu resumen mensual. ¡Sigue trabajando para alcanzar tus metas!";

    let userProfile = switch (textMap.get(userProfiles, userId)) {
      case (null) {
        {
          name = "Usuario";
          companyName = "Duat Logistics";
          salary = 0;
          currency = "€";
          language = "es";
          monthlyGoal = 0;
        };
      };
      case (?profile) { profile };
    };

    let monthlySummary = switch (intMap.get(monthlySummaries, month)) {
      case (null) {
        {
          userId;
          month;
          totalToReceive = 0;
          expenses = 0;
          netBalance = 0;
          timestamp = Time.now();
        };
      };
      case (?summary) { summary };
    };

    let breakdown = await getMonthlyBreakdown(userId, month);

    let title = if (Text.size(userProfile.name) > 0) {
      "Resumen de " # userProfile.name;
    } else {
      defaultTitle;
    };

    let subtitle = if (monthlySummary.totalToReceive > 0) {
      "Total a recibir: " # Int.toText(monthlySummary.totalToReceive) # userProfile.currency;
    } else {
      defaultSubtitle;
    };

    let message = if (breakdown.netBalance > 0) {
      "¡Felicidades! Tu balance neto es positivo: " # Int.toText(breakdown.netBalance) # userProfile.currency;
    } else if (breakdown.netBalance < 0) {
      "Atención: Tu balance neto es negativo: " # Int.toText(breakdown.netBalance) # userProfile.currency;
    } else {
      defaultMessage;
    };

    let imagePath = if (breakdown.netBalance > 0) {
      "/images/positive-summary.png";
    } else if (breakdown.netBalance < 0) {
      "/images/negative-summary.png";
    } else {
      defaultImagePath;
    };

    let categoryBreakdown = Array.map<CategorySummary, CategoryBreakdown>(
      breakdown.categorySummaries,
      func(cat : CategorySummary) : CategoryBreakdown {
        {
          categoryName = cat.categoryName;
          tripCount = cat.tripCount;
        };
      },
    );

    let categoryBreakdownText = Array.foldLeft<CategoryBreakdown, Text>(
      categoryBreakdown,
      "",
      func(acc : Text, breakdown : CategoryBreakdown) : Text {
        if (Text.size(acc) == 0) {
          breakdown.categoryName # ": " # Int.toText(breakdown.tripCount);
        } else {
          acc # " | " # breakdown.categoryName # ": " # Int.toText(breakdown.tripCount);
        };
      },
    );

    {
      title;
      subtitle;
      totalToReceive = monthlySummary.totalToReceive;
      expenses = monthlySummary.expenses;
      netBalance = monthlySummary.netBalance;
      categories = breakdown.categorySummaries;
      entryTypes = breakdown.entryTypeSummaries;
      message;
      imagePath;
      categoryBreakdown;
      categoryBreakdownText;
    };
  };

  public func exportVisualSummary(userId : Text, month : Int) : async VisualSummaryWithBreakdown {
    let visualSummary = await generateVisualSummary(userId, month);

    if (visualSummary.totalToReceive == 0 and visualSummary.expenses == 0 and visualSummary.netBalance == 0) {
      {
        title = "Resumen Mensual Vacío";
        subtitle = "No se encontraron datos para el mes seleccionado";
        totalToReceive = 0;
        expenses = 0;
        netBalance = 0;
        categories = [];
        entryTypes = [];
        message = "No se encontraron registros para el mes seleccionado. Por favor, verifica que hayas ingresado tus datos correctamente.";
        imagePath = "/images/empty-summary.png";
        categoryBreakdown = [];
        categoryBreakdownText = "";
      };
    } else {
      visualSummary;
    };
  };

  public func registerFileReference(path : Text, hash : Text) : async () {
    Registry.add(registry, path, hash);
  };

  public func getFileReference(path : Text) : async Registry.FileReference {
    Registry.get(registry, path);
  };

  public func listFileReferences() : async [Registry.FileReference] {
    Registry.list(registry);
  };

  public func dropFileReference(path : Text) : async () {
    Registry.remove(registry, path);
  };
};
