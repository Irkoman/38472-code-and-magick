function getMessage(a, b) {
  if (typeof a == 'boolean') {
    if (a == true) {
      return('Я попал в ' + b);
    }
    else {
      return('Я никуда не попал');
    }
  }

  if (typeof a == 'number') {
    return('Я прыгнул на ' + (a * 100) + ' сантиметров');
  }

  if (Array.isArray(a) && !(Array.isArray(b))) {
    var  sum = 0;

    for (var i = 0; i < a.length; i++) {
      sum += a[i];
    }

    return('Я прошёл ' + sum + ' шагов');
  }

  if ( Array.isArray(a) && Array.isArray(b) ) {
    var length = 0;
    var total_length = 0;

    for (var i = 0; i < a.length; i++) {
      length = a[i] * b[i];
      total_length += length;
    }

    return('Я прошёл ' + total_length + ' метров');
  }
}
