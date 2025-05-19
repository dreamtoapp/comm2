// lib/swal-config.ts
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ReactSwal = withReactContent(Swal);

// Configure default settings
ReactSwal.mixin({
  // direction: 'rtl',
  customClass: {
    container: 'font-cairo', // Arabic font
    title: 'text-lg font-semibold mb-2',
    htmlContainer: 'text-muted-foreground',
    confirmButton: 'bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90',
    cancelButton:
      'bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-destructive/90 mr-2',
    actions: 'gap-2 mt-4',
  },
  buttonsStyling: false,
  showClass: {
    popup: 'animate-in fade-in-90 zoom-in-105',
  },
  hideClass: {
    popup: 'animate-out fade-out-90 zoom-out-105',
  },
});

export default ReactSwal;
