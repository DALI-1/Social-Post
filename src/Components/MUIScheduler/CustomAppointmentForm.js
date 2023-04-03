import * as React from 'react';
import {
  Scheduler,
  DayView,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  ConfirmationDialog,
} from '@devexpress/dx-react-scheduler-material-ui';
import { Editor } from "@tinymce/tinymce-react";
import { createTheme, Pivot, PivotItem, ThemeProvider } from "@fluentui/react";
export const TextEditor = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  if (props.type === 'multilineTextEditor') {
    return null;
  } return <AppointmentForm.TextEditor {...props} />;
};

 export const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
  const onCustomFieldChange = (nextValue) => {
    onFieldChange({ customField: nextValue });
  };

  return (
    <AppointmentForm.BasicLayout
      appointmentData={appointmentData}
      onFieldChange={onFieldChange}
      {...restProps}>
      
      <Pivot>
        <PivotItem headerText="Create Post">
          <>
          <Editor
      apiKey="2799f8796591457f78a7a7636bd6c87c8fa239e48933e8a6b46c7f3631dca581"
      init={{
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage  tableofcontents footnotes mergetags autocorrect typography inlinecss',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        toolbar_location: "top",
        menubar: true,
        statusbar: true,
        height: 200
      }}
      initialValue="Your Post here"
    />
          </>
        </PivotItem>
        <PivotItem headerText="Add Pattern">
         <p>Hi</p>
        </PivotItem>
      </Pivot>

      {/*<AppointmentForm.Label
        text="Post"
        type="title"
      />
      <AppointmentForm.TextEditor
        value={appointmentData.customField}
        onValueChange={onCustomFieldChange}
        placeholder="Custom field"
  />*/}
    </AppointmentForm.BasicLayout>
  );
};