import { app } from "@/atoms/kuepa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { leadService } from "@/services/leadService";
import { programService } from "@/services/programSerivce";
import { useEffect, useState } from "react";

export interface LeadsProps {}

export default function Leads(props?: LeadsProps) {
  useEffect(() => {
    app.set({
      ...(app.get() || {}),
      app: "kuepa",
      module: "leads",
      window: "crm",
      back: null,
      accent: "purple",
      breadcrumb: [
        {
          title: "Leads",
          url: "/leads",
        },
      ],
    });
  }, []);

  enum NamePrefix {
    Mr = "Mr",
    Ms = "Ms",
    Mrs = "Mrs",
    Dr = "Dr",
    Prof = "Prof",
  }

  type T_NamePrefix = keyof typeof NamePrefix;

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile_phone, setCellphone] = useState("");

  const [full_name, setFullName] = useState("");
  const [status, setStatus] = useState("active");
  const [name_prefix, setNamePrefix] = useState<T_NamePrefix | undefined>(undefined);
  const [programs, setPrograms] = useState([]);
  const [interestProgram, setSelectedValue] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await programService.get();
        setPrograms(data.list);
      } catch (err) {
        console.error("Error fetching programs:", err);
      }
    };
    fetchPrograms();
  }, []);

  const handleNameChange = (e) => {
    setFirstName(e.target.value);
    setFullName(`${e.target.value} ${last_name}`.trim());
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    setFullName(`${first_name} ${e.target.value}`.trim());
  };

  const toggleStatus = () => {
    setStatus((prevStatus) =>
      prevStatus === "active" ? "inactive" : "active"
    );
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setFullName("");
    setStatus("active");
    setSelectedValue(null);
  };

  const onSubmitForm = async (formData: React.FormEvent<HTMLFormElement>) => {
    formData.preventDefault();
    try {
      const response = await leadService.upsert({
        full_name,
        first_name,
        last_name,
        email,
        mobile_phone,
        interestProgram,
        status,
      });
      resetForm();
    } catch (error) {
      console.error("Error al guardar lead:", error);
    }
  };

  const prefix: T_NamePrefix[] = Object.keys(NamePrefix) as T_NamePrefix[];

  return (
    <>
      <h1 className='flex text-4xl font-title text-purple-800'>
        Ingreso de prospectos
      </h1>
      <p className='text-xl'>
        Registre los estudiantes interesados (Prospectos) a continuación
      </p>

      <form onSubmit={onSubmitForm} className='flex flex-col gap-4 py-4 '>
        <Label htmlFor='full_name'>
          {"Nombre Completo"}
          <Input
            type='text'
            className='my-2'
            disabled
            value={full_name}
            id='full_name'
          />
        </Label>
        <Label htmlFor='first_name'>
          {"Nombres"}
          <Input
            type='text'
            className='my-2'
            placeholder='Nombre del prospecto'
            onChange={handleNameChange}
            id='first_name'
            value={first_name}
            required
          />
        </Label>
        <Label htmlFor='last_name'>
          {"Apellidos"}
          <Input
            type='text'
            className='my-2'
            placeholder='Apellido del prospecto'
            onChange={handleLastNameChange}
            id='last_name'
            value={last_name}
            required
          />
        </Label>
        <Label htmlFor='email'>
          {"Correo"}
          <Input
            type='email'
            className='my-2'
            placeholder='Correo de contacto'
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            id='email'
            required
          />
        </Label>
        <Label htmlFor='mobile_phone'>
          {"Numero Telefono"}
          <Input
            type='text'
            className='my-2'
            placeholder='Número de celular'
            onChange={(e) => {
              setCellphone(e.target.value);
            }}
            id='mobile_phone'
          />
        </Label>
        <Label htmlFor='interestProgram'>
          {"Programa de interes"}
          <Select onValueChange={(value) => setSelectedValue(value)}>
            <SelectTrigger className='mt-2'>
              <SelectValue placeholder='Selecciona un programa de interes' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {programs.map((program) => (
                  <SelectItem key={program._id} value={program._id}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Label>

        <Label htmlFor='name_prefix'>
          {"Prefijo"}
          <Select onValueChange={(value) => setSelectedValue(value)}>
            <SelectTrigger className='mt-2'>
              <SelectValue placeholder='Cual es el prefijo del prospecto' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {prefix.map((prefix) => (
                  <SelectItem key={prefix} value={prefix}>
                    {NamePrefix[prefix]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Label>

        <Label htmlFor='status' className='flex items-center'>
          {"Prospecto activo"}
          <Switch
            className=' mx-4'
            checked={status === "active"}
            onCheckedChange={toggleStatus}
            id='status'
          />
        </Label>
        <div className='flex gap-4'>
          <Button type='submit' tone='purple'>
            Guardar
          </Button>
          <Button type='reset' variant='secondary' onClick={resetForm}>
            Limpiar
          </Button>
        </div>
      </form>
    </>
  );
}
