export function createVirtualOrderData(count) {
  const virtualOrderData = [];

  function pmRandom(seed) {
    let t = seed % 2147483647;
    if (t <= 0) t += 2147483646;
    return function () {
      t = (t * 16807) % 2147483647;
      return (t - 1) / 2147483646;
    };
  }

  const seed = 123456789;
  const rand = pmRandom(seed);

  function randInt(min, max) {
    return Math.floor(rand() * (max - min + 1)) + min;
  }

  function randChoice(arr) {
    return arr[Math.floor(rand() * arr.length)];
  }

  function pickAvoidTriplet(arr, fieldName) {
    let v = randChoice(arr);
    if (virtualOrderData.length >= 2) {
      const prevItems = virtualOrderData;
      const a = prevItems[virtualOrderData.length - 1][fieldName];
      const b = prevItems[virtualOrderData.length - 2][fieldName];
      if (a === b && a === v) {
        const alt = arr.filter((s) => s !== v);
        if (alt.length > 0) {
          v = randChoice(alt);
        }
      }
    }
    return v;
  }

  const names = [
    'Maria', 'Ana Trujillo', 'Antonio Moreno', 'Thomas Hardy', 'Christina Berglund', 'Hanna Moos', 'Frederique Citeaux', 'Martin Sommer', 'Laurence Lebihan', 'Elizabeth Lincoln',
    'Victoria Ashworth', 'Patricio Simpson', 'Francisco Chang', 'Yang Wang', 'Pedro Afonso', 'Elizabeth Brown', 'Sven Ottlieb', 'Janine Labrune', 'Ann Devon', 'Roland Mendel',
    'Aria Cruz', 'Diego Roel', 'Martine Rance', 'Maria Larsson', 'Peter Franken', 'Carine Schmitt', 'Paolo Accorti', 'Lino Rodriguez', 'Eduardo Saavedra', 'Jose Pedro Freyre',
    'Andre Fonseca', 'Howard Snyder', 'Manuel Pereira', 'Mario Pontes', 'Carlos Hernández', 'Yoshi Latimer', 'Patricia McKenna', 'Helen Bennett', 'Philip Cramer', 'Daniel Tonini',
    'Annette Roulet', 'Yoshi Tannamuri', 'John Steel', 'Renate Messner', 'Jaime Yorres', 'Carlos Gonzalez', 'Felipe Izquierdo', 'Fran Wilson', 'Giovanni Rovelli', 'Catherine Dewey',
    'Jean Fresnière', 'Alexander Feuer', 'Simon Crowther', 'Yvonne Moncada', 'Rene Phillips', 'Henriette Pfalzheim', 'Marie Bertrand', 'Guillermo Fernandez', 'Georg Pipps', 'Isabel de Castro',
    'Bernardo Batista', 'Lucia Carvalho', 'Horst Kloss', 'Sergio Gutierrez', 'Paula Wilson', 'Maurizio Moroni', 'Janete Limeira', 'Michael Holz', 'Alejandra Camino', 'Jonas Bergulfsen',
    'Jose Pavarotti', 'Hari Kumar', 'Jytte Petersen', 'Dominique Perrier', 'Art Braunschweiger', 'Pascale Cartrain', 'Liz Nixon', 'Liu Wong', 'Karin Josephs', 'Miguel Angel Paolino',
    'Anabela Domingues', 'Helvetius Nagy', 'Palle Ibsen', 'Mary Saveley', 'Paul Henriot', 'Rita Muller', 'Pirkko Koskitalo', 'Paula Parente', 'Karl Jablonski', 'Matti Karttunen',
    'Zbyszek Piestrzeniewicz', 'Juan Martinez', 'Rosa Garcia', 'Miguel Ramirez', 'Teresa Lopez', 'Carlos Flores', 'Dolores Sanchez', 'Fernando Rodriguez', 'Luz Gutierrez', 'Rafael Diaz',
  ];

  const products = [
    'Chai', 'Boysenberry Spread', 'Aniseed Syrup', 'Cajun Seasoning', 'Chang', 'Organic Dried Pears', 'Mishi Kobe Niku', 'Ikura', 'Queso Cabrales', 'Pavlova',
  ];

  const categories = ['Beverages', 'Grains/Cereals', 'Confections', 'Dairy Products', 'Condiments', 'Meat/Poultry', 'Seafood'];
  const paymentMethods = ['Card', 'Digital', 'Cash'];
  const orderStatuses = [ 'Ready To Ship', 'In Transit', 'Delivered'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const cityCountryMapping = [
    { city: 'Seattle', state: 'WA', country: 'USA' },
    { city: 'Austin', state: 'TX', country: 'USA' },
    { city: 'Boston', state: 'MA', country: 'USA' },
    { city: 'Chicago', state: 'IL', country: 'USA' },
    { city: 'San Francisco', state: 'CA', country: 'USA' },
    { city: 'New York', state: 'NY', country: 'USA' },
    { city: 'Toronto', state: 'ON', country: 'Canada' },
    { city: 'Vancouver', state: 'BC', country: 'Canada' },
    { city: 'Mexico City', state: 'DF', country: 'Mexico' },
    { city: 'London', state: 'ENG', country: 'UK' },
  ];

  const warehouses = ['WH-A', 'WH-B', 'WH-C', 'WH-D'];

  const productToCategory = {};
  for (let k = 0; k < products.length; k++) {
    productToCategory[products[k]] = categories[k % categories.length];
  }

  const customerPhoneMap = {};
  const customerShippingMap = {};
  for (let j = 0; j < names.length; j++) {
    customerPhoneMap[names[j]] = `+1-${randInt(200, 999)}-${randInt(1000, 9999)}`;
    const cityLocation = cityCountryMapping[j % cityCountryMapping.length];
    const shipAddress = `${randInt(10, 999)} ${randChoice(['Main St', 'Market St', '1st Ave', 'Broadway'])}`;
    const shipPostalCode = String(randInt(10000, 99999));
    customerShippingMap[names[j]] = {
      shipAddress: shipAddress,
      shipCity: cityLocation.city,
      shipState: cityLocation.state,
      shipCountry: cityLocation.country,
      shipPostalCode: shipPostalCode,
    };
  }

  function computeAmounts(qty, unitPrice, discountPct, taxPct, shippingFee) {
    const gross = Math.round(qty * unitPrice * 100) / 100;
    const discount = Math.round((gross * discountPct / 100) * 100) / 100;
    const subtotal = Math.round((gross - discount) * 100) / 100;
    const tax = Math.round((subtotal * taxPct / 100) * 100) / 100;
    const total = Math.round((subtotal + tax + shippingFee) * 100) / 100;
    return {
      gross,
      subtotal,
      discountAmount: discount,
      taxAmount: tax,
      totalAmount: total
    };
  }

  const baseOrderDate = new Date(2026, 0, 1);
  const ordersPerDay = 30;

  for (let i = 1; i <= count; i++) {
    const qty = randInt(1, 10);
    const unitPrice = Math.round((rand() * 500 + 5) * 100) / 100;
    const discountPct = randInt(0, 20);
    const taxPct = randInt(0, 18);
    const shippingFee = Math.round(rand() * 20 * 100) / 100;
    const amounts = computeAmounts(qty, unitPrice, discountPct, taxPct, shippingFee);

    const dayIndex = Math.floor(i / ordersPerDay);
    const totalDaysInRange = 181;
    const cycleDayIndex = dayIndex % totalDaysInRange;
    const orderDate = new Date(baseOrderDate);
    orderDate.setDate(baseOrderDate.getDate() + cycleDayIndex);

    const shippedDate = new Date(orderDate);
    shippedDate.setDate(orderDate.getDate() + randInt(1, 5));

    const customerId = randInt(1000, 9999);
    const custName = randChoice(names);
    const email = custName.toLowerCase().replace(/\s+/g, '.') + '@example.com';
    const rating = randInt(1, 5);
    const orderStatusVal = pickAvoidTriplet(orderStatuses, 'OrderStatus');

    let paymentMethod;
    if (orderStatusVal === 'Canceled' || orderStatusVal === 'Shipped') {
      const nonCashMethods = paymentMethods.filter((m) => m !== 'Cash');
      paymentMethod = randChoice(nonCashMethods);
    } else {
      paymentMethod = pickAvoidTriplet(paymentMethods, 'PaymentMethod');
    }

    const priorityVal = pickAvoidTriplet(priorities, 'Priority');
    const productName = randChoice(products);
    const derivedCategory = productToCategory[productName] || randChoice(categories);
    const warehouse = randChoice(warehouses);
    const inventoryCount = randInt(0, 500);

    let paymentStatus = 'Pending';
    if (orderStatusVal === 'Pending') {
      paymentStatus = 'Pending';
    } else if (orderStatusVal === 'Canceled') {
      paymentStatus = 'Refunded';
    } else {
      paymentStatus = 'Paid';
    }

    const customerShipping = customerShippingMap[custName];
    const shipAddress = customerShipping.shipAddress;
    const shipCity = customerShipping.shipCity;
    const shipState = customerShipping.shipState;
    const shipPostalCode = customerShipping.shipPostalCode;
    const shipCountry = customerShipping.shipCountry;

    virtualOrderData.push({
      OrderID: `ORD-${1000 + count - i + 1}`,
      OrderDate: orderDate,
      ShipDate: shippedDate,
      CustomerID: `CUS-${customerId}`,
      CustomerName: custName,
      Email: email,
      Phone: customerPhoneMap[custName],
      ShipAddress: shipAddress,
      ShipCity: shipCity,
      ShipState: shipState,
      ShipPostalCode: shipPostalCode,
      ShipCountry: shipCountry,
      ShipDetails: `${shipAddress},\n${shipCity} - ${shipPostalCode}`,
      ProductID: `PROD-${randInt(10000, 99999)}`,
      ProductName: productName,
      Category: derivedCategory,
      Quantity: qty,
      UnitPrice: unitPrice,
      Discount: discountPct,
      Tax: taxPct,
      SubTotal: amounts.subtotal,
      DiscountAmount: amounts.discountAmount,
      GrossAmount: amounts.gross,
      TaxAmount: amounts.taxAmount,
      ShipFee: shippingFee,
      TotalAmount: amounts.totalAmount,
      PaymentMethod: paymentMethod,
      PaymentStatus: paymentStatus,
      Warehouse: warehouse,
      InventoryCount: inventoryCount,
      Priority: priorityVal,
      OrderStatus: orderStatusVal,
      Rating: rating,
    });
  }

  return virtualOrderData;
}

export function makeData(count) {
  const virtualOrderData = [];

  function pmRandom(seed) {
    let t = seed % 2147483647;
    if (t <= 0) t += 2147483646;
    return function () {
      t = (t * 16807) % 2147483647;
      return (t - 1) / 2147483646;
    };
  }

  const seed = 123456789;
  const rand = pmRandom(seed);

  function randInt(min, max) {
    return Math.floor(rand() * (max - min + 1)) + min;
  }

  function randChoice(arr) {
    return arr[Math.floor(rand() * arr.length)];
  }

  function pickAvoidTriplet(arr, fieldName) {
    let v = randChoice(arr);
    if (virtualOrderData.length >= 2) {
      const prevItems = virtualOrderData;
      const a = prevItems[virtualOrderData.length - 1][fieldName];
      const b = prevItems[virtualOrderData.length - 2][fieldName];
      if (a === b && a === v) {
        const alt = arr.filter((s) => s !== v);
        if (alt.length > 0) {
          v = randChoice(alt);
        }
      }
    }
    return v;
  }

  const names = [
    'Maria', 'Ana Trujillo', 'Antonio Moreno', 'Thomas Hardy', 'Christina Berglund', 'Hanna Moos', 'Frederique Citeaux', 'Martin Sommer', 'Laurence Lebihan', 'Elizabeth Lincoln',
    'Victoria Ashworth', 'Patricio Simpson', 'Francisco Chang', 'Yang Wang', 'Pedro Afonso', 'Elizabeth Brown', 'Sven Ottlieb', 'Janine Labrune', 'Ann Devon', 'Roland Mendel',
    'Aria Cruz', 'Diego Roel', 'Martine Rance', 'Maria Larsson', 'Peter Franken', 'Carine Schmitt', 'Paolo Accorti', 'Lino Rodriguez', 'Eduardo Saavedra', 'Jose Pedro Freyre',
    'Andre Fonseca', 'Howard Snyder', 'Manuel Pereira', 'Mario Pontes', 'Carlos Hernández', 'Yoshi Latimer', 'Patricia McKenna', 'Helen Bennett', 'Philip Cramer', 'Daniel Tonini',
    'Annette Roulet', 'Yoshi Tannamuri', 'John Steel', 'Renate Messner', 'Jaime Yorres', 'Carlos Gonzalez', 'Felipe Izquierdo', 'Fran Wilson', 'Giovanni Rovelli', 'Catherine Dewey',
    'Jean Fresnière', 'Alexander Feuer', 'Simon Crowther', 'Yvonne Moncada', 'Rene Phillips', 'Henriette Pfalzheim', 'Marie Bertrand', 'Guillermo Fernandez', 'Georg Pipps', 'Isabel de Castro',
    'Bernardo Batista', 'Lucia Carvalho', 'Horst Kloss', 'Sergio Gutierrez', 'Paula Wilson', 'Maurizio Moroni', 'Janete Limeira', 'Michael Holz', 'Alejandra Camino', 'Jonas Bergulfsen',
    'Jose Pavarotti', 'Hari Kumar', 'Jytte Petersen', 'Dominique Perrier', 'Art Braunschweiger', 'Pascale Cartrain', 'Liz Nixon', 'Liu Wong', 'Karin Josephs', 'Miguel Angel Paolino',
    'Anabela Domingues', 'Helvetius Nagy', 'Palle Ibsen', 'Mary Saveley', 'Paul Henriot', 'Rita Muller', 'Pirkko Koskitalo', 'Paula Parente', 'Karl Jablonski', 'Matti Karttunen',
    'Zbyszek Piestrzeniewicz', 'Juan Martinez', 'Rosa Garcia', 'Miguel Ramirez', 'Teresa Lopez', 'Carlos Flores', 'Dolores Sanchez', 'Fernando Rodriguez', 'Luz Gutierrez', 'Rafael Diaz',
  ];

  const products = [
    'Chai', 'Boysenberry Spread', 'Aniseed Syrup', 'Cajun Seasoning', 'Chang', 'Organic Dried Pears', 'Mishi Kobe Niku', 'Ikura', 'Queso Cabrales', 'Pavlova',
  ];

  const categories = ['Beverages', 'Grains/Cereals', 'Confections', 'Dairy Products', 'Condiments', 'Meat/Poultry', 'Seafood'];
  const paymentMethods = ['Card', 'Digital', 'Cash'];
  const orderStatuses = ['Ready To Ship', 'In Transit', 'Delivered'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const cityCountryMapping = [
    { city: 'Seattle', state: 'WA', country: 'USA' },
    { city: 'Austin', state: 'TX', country: 'USA' },
    { city: 'Boston', state: 'MA', country: 'USA' },
    { city: 'Chicago', state: 'IL', country: 'USA' },
    { city: 'San Francisco', state: 'CA', country: 'USA' },
    { city: 'New York', state: 'NY', country: 'USA' },
    { city: 'Toronto', state: 'ON', country: 'Canada' },
    { city: 'Vancouver', state: 'BC', country: 'Canada' },
    { city: 'Mexico City', state: 'DF', country: 'Mexico' },
    { city: 'London', state: 'ENG', country: 'UK' },
  ];

  const warehouses = ['WH-A', 'WH-B', 'WH-C', 'WH-D'];

  const productToCategory = {};
  for (let k = 0; k < products.length; k++) {
    productToCategory[products[k]] = categories[k % categories.length];
  }

  const customerPhoneMap = {};
  const customerShippingMap = {};
  for (let j = 0; j < names.length; j++) {
    customerPhoneMap[names[j]] = `+1-${randInt(200, 999)}-${randInt(1000, 9999)}`;
    const cityLocation = cityCountryMapping[j % cityCountryMapping.length];
    const shipAddress = `${randInt(10, 999)} ${randChoice(['Main St', 'Market St', '1st Ave', 'Broadway'])}`;
    const shipPostalCode = String(randInt(10000, 99999));
    customerShippingMap[names[j]] = {
      shipAddress: shipAddress,
      shipCity: cityLocation.city,
      shipState: cityLocation.state,
      shipCountry: cityLocation.country,
      shipPostalCode: shipPostalCode,
    };
  }

  function computeAmounts(qty, unitPrice, discountPct, taxPct, shippingFee) {
    const gross = Math.round(qty * unitPrice * 100) / 100;
    const discount = Math.round((gross * discountPct / 100) * 100) / 100;
    const subtotal = Math.round((gross - discount) * 100) / 100;
    const tax = Math.round((subtotal * taxPct / 100) * 100) / 100;
    const total = Math.round((subtotal + tax + shippingFee) * 100) / 100;
    return {
      gross,
      subtotal,
      discountAmount: discount,
      taxAmount: tax,
      totalAmount: total
    };
  }

  const baseOrderDate = new Date(2026, 0, 1);
  const ordersPerDay = 30;

  for (let i = 1; i <= count; i++) {
    const qty = randInt(1, 10);
    const unitPrice = Math.round((rand() * 500 + 5) * 100) / 100;
    const discountPct = randInt(0, 20);
    const taxPct = randInt(0, 18);
    const shippingFee = Math.round(rand() * 20 * 100) / 100;
    const amounts = computeAmounts(qty, unitPrice, discountPct, taxPct, shippingFee);

    const dayIndex = Math.floor(i / ordersPerDay);
    const totalDaysInRange = 181;
    const cycleDayIndex = dayIndex % totalDaysInRange;
    const orderDate = new Date(baseOrderDate);
    orderDate.setDate(baseOrderDate.getDate() + cycleDayIndex);

    const shippedDate = new Date(orderDate);
    shippedDate.setDate(orderDate.getDate() + randInt(1, 5));

    const customerId = randInt(1000, 9999);
    const custName = randChoice(names);
    const email = custName.toLowerCase().replace(/\s+/g, '.') + '@example.com';
    const rating = randInt(1, 5);
    const orderStatusVal = pickAvoidTriplet(orderStatuses, 'OrderStatus');

    let paymentMethod;
    if (orderStatusVal === 'Canceled' || orderStatusVal === 'Shipped') {
      const nonCashMethods = paymentMethods.filter((m) => m !== 'Cash');
      paymentMethod = randChoice(nonCashMethods);
    } else {
      paymentMethod = pickAvoidTriplet(paymentMethods, 'PaymentMethod');
    }

    let priorityVal;
    let paymentStatus;

    // Force ONLY 2 rows to have PaymentStatus='Paid' AND Priority='Critical'
    if (i === 1 || i === Math.floor(count / 2)) {
      paymentStatus = 'Paid';
      priorityVal = 'Critical';
    } else {
      // For all other rows, ensure they DON'T have both conditions
      priorityVal = pickAvoidTriplet(priorities, 'Priority');
      
      // Assign payment status based on order status
      if (orderStatusVal === 'Pending') {
        paymentStatus = 'Pending';
      } else if (orderStatusVal === 'Canceled') {
        paymentStatus = 'Refunded';
      } else {
        // For non-Pending, non-Canceled orders, only set 'Paid' if Priority is NOT 'Critical'
        paymentStatus = priorityVal !== 'Critical' ? 'Paid' : 'Pending';
      }
    }

    const productName = randChoice(products);
    const derivedCategory = productToCategory[productName] || randChoice(categories);
    const warehouse = randChoice(warehouses);
    const inventoryCount = randInt(0, 500);

    const customerShipping = customerShippingMap[custName];
    const shipAddress = customerShipping.shipAddress;
    const shipCity = customerShipping.shipCity;
    const shipState = customerShipping.shipState;
    const shipPostalCode = customerShipping.shipPostalCode;
    const shipCountry = customerShipping.shipCountry;

    virtualOrderData.push({
      OrderID: `ORD-${1000 + count - i + 1}`,
      OrderDate: orderDate,
      ShipDate: shippedDate,
      CustomerID: `CUS-${customerId}`,
      CustomerName: custName,
      Email: email,
      Phone: customerPhoneMap[custName],
      ShipAddress: shipAddress,
      ShipCity: shipCity,
      ShipState: shipState,
      ShipPostalCode: shipPostalCode,
      ShipCountry: shipCountry,
      ShipDetails: `${shipAddress},\n${shipCity} - ${shipPostalCode}`,
      ProductID: `PROD-${randInt(10000, 99999)}`,
      ProductName: productName,
      Category: derivedCategory,
      Quantity: qty,
      UnitPrice: unitPrice,
      Discount: discountPct,
      Tax: taxPct,
      SubTotal: amounts.subtotal,
      DiscountAmount: amounts.discountAmount,
      GrossAmount: amounts.gross,
      TaxAmount: amounts.taxAmount,
      ShipFee: shippingFee,
      TotalAmount: amounts.totalAmount,
      PaymentMethod: paymentMethod,
      PaymentStatus: paymentStatus,
      Warehouse: warehouse,
      InventoryCount: inventoryCount,
      Priority: priorityVal,
      OrderStatus: orderStatusVal,
      Rating: rating,
    });
  }

  return virtualOrderData;
}
export let gridData=makeData(1000);
