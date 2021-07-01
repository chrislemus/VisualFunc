import classes from './fib4.module.css';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { interpreterStepsArray } from './constants';

export default function StepsDropdownFilter({ filteredSteps, onChange }) {
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-mutiple-name-label">Steps</InputLabel>
      <Select
        labelId="demo-mutiple-name-label"
        id="demo-mutiple-name"
        multiple
        value={filteredSteps}
        onChange={onChange}
        input={<Input />}
        MenuProps={{
          PaperProps: { style: { maxHeight: 224, width: 250 } },
        }}
      >
        {interpreterStepsArray.map((step) => (
          <MenuItem key={step} value={step}>
            {step}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
