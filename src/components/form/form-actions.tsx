import { Button } from "@/components/ui/button";

interface FormActionsProps {
  loading: boolean;
  mode: "create" | "edit";
  onCancel: () => void;
}

export function FormActions({ loading, mode, onCancel }: FormActionsProps) {
  return (
    <div className="xs:flex-row flex w-full flex-col gap-4">
      <Button type="submit" disabled={loading}>
        {loading ? "Guardando..." : mode === "create" ? "Crear Vehículo" : "Guardar Cambios"}
      </Button>
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
    </div>
  );
}
