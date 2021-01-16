## Summary

This project introduced the following concepts:
- Navigation using the [React Navigation library.](https://reactnavigation.org/docs/tab-based-navigation)
- Tab navigation
- Stack navigation
- Sharing state between screens using State Containers (see `store.js`)

#### Skipped Sections
- Since all the navigation stuff meant I had to try to learn it all from the docs anyway, I skipped the options screen and drawer navigation as that wouldn't immediately be useful for my role at gutenberg-mobile. 
- Couldn't get deep linking to work so ended up removing it for now

## Notes
#### Reworked code using updated React navigation library
- The book used the old version of the Navigation Library so I had to completely rework it and follow the current official guides. 

#### Updated usge for uuidv4
The stuff from the book is completely outdated, use this instead:

Install `uuid` and `react-native-get-random-values` package:
```
yarn add uuid react-native-get-random-values
```

Then update the file, make sure the `react-native-get-random-values` is at the very top!

```
import `react-native-get-random-values;
import { v4 as uuidv4 } from 'uuid';
```

#### Icons
Updated usage for [icons](https://github.com/oblador/react-native-vector-icons).
```
> yarn add react-native-vector-icons
```
Usage (see `routes.js` for example usage)
```
import Icon from 'react-native-vector-icons/MaterialIcons';

<Icon name="list" color={ color } size={ size } />
```

