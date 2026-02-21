// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  FormField,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { Switch } from "../components/ui/switch";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

/**
 * Form components with SKYNET cyber-panel styling.
 * Accessible form field wrappers for labels, inputs, errors, and help text.
 */
const meta = {
  title: "Components/Form",
  component: FormField,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Form field components with SKYNET cyberpunk styling. Includes FormField (wrapper), FormLabel, FormMessage (errors), and FormDescription (help text). Designed for accessibility with proper ARIA associations.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Simple Form with Validation
// ============================================================================

const SimpleFormDemo = () => {
  const [callsign, setCallsign] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (callsign.length < 2) {
      setError("Callsign must be at least 2 characters");
      return;
    }
    if (!/^[A-Z0-9]+$/i.test(callsign)) {
      setError("Callsign must be alphanumeric only");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="w-[320px] space-y-4">
      <FormField>
        <FormLabel htmlFor="callsign" required>
          CALLSIGN
        </FormLabel>
        <Input
          id="callsign"
          placeholder="Enter callsign..."
          value={callsign}
          onChange={(e) => {
            setCallsign(e.target.value.toUpperCase());
            setError("");
            setSubmitted(false);
          }}
          error={!!error}
          aria-describedby="callsign-error callsign-desc"
        />
        <FormDescription id="callsign-desc">
          Your unique pilot identification
        </FormDescription>
        <FormMessage error id="callsign-error">
          {error}
        </FormMessage>
      </FormField>
      <div className="flex gap-2">
        <Button type="submit">VALIDATE</Button>
        {submitted && (
          <Badge variant="success">VALID: {callsign}</Badge>
        )}
      </div>
    </form>
  );
};

export const SimpleValidation: Story = {
  render: () => <SimpleFormDemo />,
  args: { children: null },
  parameters: {
    docs: {
      description: {
        story:
          "Basic form with real-time validation. Shows error states and success feedback.",
      },
    },
  },
};

// ============================================================================
// Training Configuration Form (Aviation-themed)
// ============================================================================

const TrainingConfigFormDemo = () => {
  const [config, setConfig] = useState({
    learningRate: "3e-4",
    batchSize: "64",
    nEnvs: "8",
    epochs: "10",
    useBc: true,
    useHer: true,
    useCuriosity: false,
    useWorldModel: false,
    vecNormalize: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateNumber = (value: string, min: number, max: number) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "Must be a valid number";
    if (num < min || num > max) return `Must be between ${min} and ${max}`;
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const batchError = validateNumber(config.batchSize, 1, 512);
    if (batchError) newErrors.batchSize = batchError;

    const envError = validateNumber(config.nEnvs, 1, 64);
    if (envError) newErrors.nEnvs = envError;

    const epochError = validateNumber(config.epochs, 1, 100);
    if (epochError) newErrors.epochs = epochError;

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      alert("Configuration saved successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-[400px] space-y-6">
      <div className="p-4 border border-border bg-card/50">
        <h3 className="font-display text-sm text-primary mb-4">
          PPO HYPERPARAMETERS
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField>
            <FormLabel htmlFor="lr" required>
              LEARNING RATE
            </FormLabel>
            <Input
              id="lr"
              value={config.learningRate}
              onChange={(e) =>
                setConfig({ ...config, learningRate: e.target.value })
              }
              className="font-mono"
            />
            <FormDescription>Default: 3e-4</FormDescription>
          </FormField>

          <FormField>
            <FormLabel htmlFor="batch" required>
              BATCH SIZE
            </FormLabel>
            <Input
              id="batch"
              type="number"
              value={config.batchSize}
              onChange={(e) =>
                setConfig({ ...config, batchSize: e.target.value })
              }
              error={!!errors.batchSize}
              className="font-mono"
            />
            <FormMessage error>{errors.batchSize}</FormMessage>
          </FormField>

          <FormField>
            <FormLabel htmlFor="envs" required>
              N ENVIRONMENTS
            </FormLabel>
            <Input
              id="envs"
              type="number"
              value={config.nEnvs}
              onChange={(e) =>
                setConfig({ ...config, nEnvs: e.target.value })
              }
              error={!!errors.nEnvs}
              className="font-mono"
            />
            <FormMessage error>{errors.nEnvs}</FormMessage>
          </FormField>

          <FormField>
            <FormLabel htmlFor="epochs" required>
              EPOCHS
            </FormLabel>
            <Input
              id="epochs"
              type="number"
              value={config.epochs}
              onChange={(e) =>
                setConfig({ ...config, epochs: e.target.value })
              }
              error={!!errors.epochs}
              className="font-mono"
            />
            <FormMessage error>{errors.epochs}</FormMessage>
          </FormField>
        </div>
      </div>

      <div className="p-4 border border-border bg-card/50">
        <h3 className="font-display text-sm text-primary mb-4">
          TRAINING FEATURES
        </h3>
        <div className="space-y-3">
          <FormField className="flex items-center justify-between">
            <div>
              <FormLabel htmlFor="bc">BEHAVIORAL CLONING</FormLabel>
              <FormDescription>Self-imitation from best trajectories</FormDescription>
            </div>
            <Switch
              id="bc"
              checked={config.useBc}
              onCheckedChange={(checked) =>
                setConfig({ ...config, useBc: checked })
              }
            />
          </FormField>

          <FormField className="flex items-center justify-between">
            <div>
              <FormLabel htmlFor="her">HINDSIGHT EXPERIENCE REPLAY</FormLabel>
              <FormDescription>Goal relabeling for sparse rewards</FormDescription>
            </div>
            <Switch
              id="her"
              checked={config.useHer}
              onCheckedChange={(checked) =>
                setConfig({ ...config, useHer: checked })
              }
            />
          </FormField>

          <FormField className="flex items-center justify-between">
            <div>
              <FormLabel htmlFor="curiosity">CURIOSITY (RND+ICM)</FormLabel>
              <FormDescription>Intrinsic exploration motivation</FormDescription>
            </div>
            <Switch
              id="curiosity"
              checked={config.useCuriosity}
              onCheckedChange={(checked) =>
                setConfig({ ...config, useCuriosity: checked })
              }
            />
          </FormField>

          <FormField className="flex items-center justify-between">
            <div>
              <FormLabel htmlFor="wm">WORLD MODEL</FormLabel>
              <FormDescription>DreamerV3 imagination training</FormDescription>
            </div>
            <Switch
              id="wm"
              checked={config.useWorldModel}
              onCheckedChange={(checked) =>
                setConfig({ ...config, useWorldModel: checked })
              }
            />
          </FormField>
        </div>
      </div>

      <div className="p-4 border border-border bg-card/50">
        <FormField className="flex items-center gap-3">
          <Checkbox
            id="vecnorm"
            checked={config.vecNormalize}
            onCheckedChange={(checked) =>
              setConfig({ ...config, vecNormalize: checked === true })
            }
          />
          <div>
            <FormLabel htmlFor="vecnorm">VECTOR NORMALIZATION</FormLabel>
            <FormDescription>
              Normalize observations and rewards (recommended)
            </FormDescription>
          </div>
        </FormField>
      </div>

      <div className="flex gap-2">
        <Button type="submit">APPLY CONFIG</Button>
        <Button type="button" variant="outline">
          RESET DEFAULTS
        </Button>
      </div>
    </form>
  );
};

export const TrainingConfiguration: Story = {
  render: () => <TrainingConfigFormDemo />,
  args: { children: null },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Aviation-themed training configuration form with hyperparameters, feature toggles, and validation.",
      },
    },
  },
};

// ============================================================================
// Login Form Example
// ============================================================================

const LoginFormDemo = () => {
  const [credentials, setCredentials] = useState({
    pilotId: "",
    accessCode: "",
    remember: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!credentials.pilotId.trim()) {
      newErrors.pilotId = "Pilot ID is required";
    }
    if (!credentials.accessCode.trim()) {
      newErrors.accessCode = "Access code is required";
    } else if (credentials.accessCode.length < 6) {
      newErrors.accessCode = "Access code must be at least 6 characters";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      setTimeout(() => setIsSubmitting(false), 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-[320px] space-y-4">
      <div className="text-center mb-6">
        <h2 className="font-display text-xl text-primary">SOFIA ACCESS</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Flight Intelligence System Authentication
        </p>
      </div>

      <FormField>
        <FormLabel htmlFor="pilotId" required>
          PILOT ID
        </FormLabel>
        <Input
          id="pilotId"
          placeholder="Enter pilot ID..."
          value={credentials.pilotId}
          onChange={(e) =>
            setCredentials({ ...credentials, pilotId: e.target.value.toUpperCase() })
          }
          error={!!errors.pilotId}
          autoComplete="username"
        />
        <FormMessage error>{errors.pilotId}</FormMessage>
      </FormField>

      <FormField>
        <FormLabel htmlFor="accessCode" required>
          ACCESS CODE
        </FormLabel>
        <Input
          id="accessCode"
          type="password"
          placeholder="Enter access code..."
          value={credentials.accessCode}
          onChange={(e) =>
            setCredentials({ ...credentials, accessCode: e.target.value })
          }
          error={!!errors.accessCode}
          autoComplete="current-password"
        />
        <FormMessage error>{errors.accessCode}</FormMessage>
      </FormField>

      <FormField className="flex items-center gap-3">
        <Checkbox
          id="remember"
          checked={credentials.remember}
          onCheckedChange={(checked) =>
            setCredentials({ ...credentials, remember: checked === true })
          }
        />
        <FormLabel htmlFor="remember" className="cursor-pointer">
          Remember this terminal
        </FormLabel>
      </FormField>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "AUTHENTICATING..." : "AUTHENTICATE"}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Unauthorized access will be logged and reported
      </p>
    </form>
  );
};

export const LoginForm: Story = {
  render: () => <LoginFormDemo />,
  args: { children: null },
  parameters: {
    docs: {
      description: {
        story:
          "Authentication form with validation, password field, and remember-me option.",
      },
    },
  },
};

// ============================================================================
// Complex Multi-field Form
// ============================================================================

const FlightPlanFormDemo = () => {
  const [flightPlan, setFlightPlan] = useState({
    departure: "",
    arrival: "",
    altitude: "",
    squawk: "",
    remarks: "",
    ifr: false,
    hazmat: false,
    priority: "normal",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAirport = (code: string) => {
    if (!code.trim()) return "Required";
    if (!/^[A-Z]{4}$/.test(code)) return "Must be 4-letter ICAO code";
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const depError = validateAirport(flightPlan.departure);
    if (depError) newErrors.departure = depError;

    const arrError = validateAirport(flightPlan.arrival);
    if (arrError) newErrors.arrival = arrError;

    if (flightPlan.departure === flightPlan.arrival && flightPlan.departure) {
      newErrors.arrival = "Arrival must differ from departure";
    }

    if (flightPlan.altitude) {
      const alt = parseInt(flightPlan.altitude);
      if (isNaN(alt) || alt < 500 || alt > 45000) {
        newErrors.altitude = "Altitude must be 500-45000 ft";
      }
    }

    if (flightPlan.squawk && !/^[0-7]{4}$/.test(flightPlan.squawk)) {
      newErrors.squawk = "Must be 4 octal digits (0-7)";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      alert("Flight plan filed successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-[450px] space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-primary">FILE FLIGHT PLAN</h2>
        <Badge variant={flightPlan.ifr ? "default" : "outline"}>
          {flightPlan.ifr ? "IFR" : "VFR"}
        </Badge>
      </div>

      <div className="p-4 border border-border bg-card/50 space-y-4">
        <h3 className="text-xs font-mono text-muted-foreground">ROUTE</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField>
            <FormLabel htmlFor="dep" required>
              DEPARTURE (ICAO)
            </FormLabel>
            <Input
              id="dep"
              placeholder="KJFK"
              maxLength={4}
              value={flightPlan.departure}
              onChange={(e) =>
                setFlightPlan({
                  ...flightPlan,
                  departure: e.target.value.toUpperCase(),
                })
              }
              error={!!errors.departure}
              className="font-mono uppercase"
            />
            <FormMessage error>{errors.departure}</FormMessage>
          </FormField>

          <FormField>
            <FormLabel htmlFor="arr" required>
              ARRIVAL (ICAO)
            </FormLabel>
            <Input
              id="arr"
              placeholder="KLAX"
              maxLength={4}
              value={flightPlan.arrival}
              onChange={(e) =>
                setFlightPlan({
                  ...flightPlan,
                  arrival: e.target.value.toUpperCase(),
                })
              }
              error={!!errors.arrival}
              className="font-mono uppercase"
            />
            <FormMessage error>{errors.arrival}</FormMessage>
          </FormField>

          <FormField>
            <FormLabel htmlFor="alt">CRUISE ALTITUDE (FT)</FormLabel>
            <Input
              id="alt"
              type="number"
              placeholder="35000"
              value={flightPlan.altitude}
              onChange={(e) =>
                setFlightPlan({ ...flightPlan, altitude: e.target.value })
              }
              error={!!errors.altitude}
              className="font-mono"
            />
            <FormMessage error>{errors.altitude}</FormMessage>
          </FormField>

          <FormField>
            <FormLabel htmlFor="squawk">SQUAWK CODE</FormLabel>
            <Input
              id="squawk"
              placeholder="1200"
              maxLength={4}
              value={flightPlan.squawk}
              onChange={(e) =>
                setFlightPlan({ ...flightPlan, squawk: e.target.value })
              }
              error={!!errors.squawk}
              className="font-mono"
            />
            <FormDescription>VFR: 1200, IFR: Assigned</FormDescription>
            <FormMessage error>{errors.squawk}</FormMessage>
          </FormField>
        </div>
      </div>

      <div className="p-4 border border-border bg-card/50 space-y-4">
        <h3 className="text-xs font-mono text-muted-foreground">
          FLIGHT RULES & OPTIONS
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField className="flex items-center gap-3">
            <Checkbox
              id="ifr"
              checked={flightPlan.ifr}
              onCheckedChange={(checked) =>
                setFlightPlan({ ...flightPlan, ifr: checked === true })
              }
            />
            <div>
              <FormLabel htmlFor="ifr">IFR FLIGHT RULES</FormLabel>
              <FormDescription>Instrument flight rules</FormDescription>
            </div>
          </FormField>

          <FormField className="flex items-center gap-3">
            <Checkbox
              id="hazmat"
              checked={flightPlan.hazmat}
              onCheckedChange={(checked) =>
                setFlightPlan({ ...flightPlan, hazmat: checked === true })
              }
            />
            <div>
              <FormLabel htmlFor="hazmat">HAZMAT CARGO</FormLabel>
              <FormDescription>Dangerous goods aboard</FormDescription>
            </div>
          </FormField>
        </div>
      </div>

      <div className="p-4 border border-border bg-card/50">
        <FormField>
          <FormLabel htmlFor="remarks">REMARKS</FormLabel>
          <Textarea
            id="remarks"
            placeholder="Enter any additional remarks, equipment codes, or special requests..."
            value={flightPlan.remarks}
            onChange={(e) =>
              setFlightPlan({ ...flightPlan, remarks: e.target.value })
            }
            rows={3}
          />
          <FormDescription>
            Include equipment codes, PBN capabilities, or special handling
          </FormDescription>
        </FormField>
      </div>

      <div className="flex gap-2">
        <Button type="submit">FILE PLAN</Button>
        <Button type="button" variant="outline">
          SAVE DRAFT
        </Button>
        <Button type="button" variant="ghost">
          CLEAR
        </Button>
      </div>
    </form>
  );
};

export const FlightPlanForm: Story = {
  render: () => <FlightPlanFormDemo />,
  args: { children: null },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Complex multi-field flight plan form with aviation-specific validation (ICAO codes, squawk codes, altitude).",
      },
    },
  },
};

// ============================================================================
// Error States Demo
// ============================================================================

export const ErrorStates: Story = {
  args: { children: null },
  render: () => (
    <div className="w-[350px] space-y-6">
      <h3 className="font-display text-lg text-foreground">ERROR STATES</h3>

      <FormField>
        <FormLabel htmlFor="error1" required>
          FIELD WITH ERROR
        </FormLabel>
        <Input
          id="error1"
          value="invalid value"
          error
          aria-describedby="error1-msg"
        />
        <FormMessage error id="error1-msg">
          This field contains an invalid value
        </FormMessage>
      </FormField>

      <FormField>
        <FormLabel htmlFor="error2" required>
          REQUIRED FIELD EMPTY
        </FormLabel>
        <Input
          id="error2"
          placeholder="This field is required"
          error
          aria-describedby="error2-msg"
        />
        <FormMessage error id="error2-msg">
          This field is required
        </FormMessage>
      </FormField>

      <FormField>
        <FormLabel htmlFor="error3">FIELD WITH WARNING</FormLabel>
        <Input id="error3" value="KXYZ" aria-describedby="error3-msg" />
        <FormMessage id="error3-msg" className="text-yellow-500">
          Warning: Unknown airport code
        </FormMessage>
      </FormField>

      <FormField>
        <FormLabel htmlFor="success">VALID FIELD</FormLabel>
        <Input
          id="success"
          value="KJFK"
          className="border-green-500 focus-visible:ring-green-500"
          aria-describedby="success-msg"
        />
        <FormMessage id="success-msg" className="text-green-500">
          Valid ICAO code: John F. Kennedy International
        </FormMessage>
      </FormField>

      <FormField>
        <FormLabel htmlFor="disabled">DISABLED FIELD</FormLabel>
        <Input
          id="disabled"
          value="Cannot edit"
          disabled
          aria-describedby="disabled-desc"
        />
        <FormDescription id="disabled-desc">
          This field is locked
        </FormDescription>
      </FormField>
    </div>
  ),
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Various error and validation states: error, warning, success, and disabled.",
      },
    },
  },
};

// ============================================================================
// Form Field Types
// ============================================================================

export const FieldTypes: Story = {
  args: { children: null },
  render: () => {
    const [values, setValues] = useState({
      text: "",
      number: "",
      email: "",
      password: "",
      textarea: "",
      checkbox: false,
      switch: false,
    });

    return (
      <div className="w-[400px] space-y-4 p-4 border border-border bg-card/50">
        <h3 className="font-display text-sm text-primary">
          SUPPORTED FIELD TYPES
        </h3>

        <FormField>
          <FormLabel htmlFor="text">TEXT INPUT</FormLabel>
          <Input
            id="text"
            type="text"
            placeholder="Enter text..."
            value={values.text}
            onChange={(e) => setValues({ ...values, text: e.target.value })}
          />
        </FormField>

        <FormField>
          <FormLabel htmlFor="number">NUMBER INPUT</FormLabel>
          <Input
            id="number"
            type="number"
            placeholder="Enter number..."
            value={values.number}
            onChange={(e) => setValues({ ...values, number: e.target.value })}
          />
        </FormField>

        <FormField>
          <FormLabel htmlFor="email">EMAIL INPUT</FormLabel>
          <Input
            id="email"
            type="email"
            placeholder="pilot@sofia.ai"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
        </FormField>

        <FormField>
          <FormLabel htmlFor="password">PASSWORD INPUT</FormLabel>
          <Input
            id="password"
            type="password"
            placeholder="Enter password..."
            value={values.password}
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />
        </FormField>

        <FormField>
          <FormLabel htmlFor="textarea">TEXTAREA</FormLabel>
          <Textarea
            id="textarea"
            placeholder="Enter longer text..."
            value={values.textarea}
            onChange={(e) => setValues({ ...values, textarea: e.target.value })}
            rows={3}
          />
        </FormField>

        <FormField className="flex items-center gap-3">
          <Checkbox
            id="checkbox"
            checked={values.checkbox}
            onCheckedChange={(checked) =>
              setValues({ ...values, checkbox: checked === true })
            }
          />
          <FormLabel htmlFor="checkbox">CHECKBOX OPTION</FormLabel>
        </FormField>

        <FormField className="flex items-center justify-between">
          <FormLabel htmlFor="switch">SWITCH TOGGLE</FormLabel>
          <Switch
            id="switch"
            checked={values.switch}
            onCheckedChange={(checked) =>
              setValues({ ...values, switch: checked })
            }
          />
        </FormField>

        <div className="pt-4 border-t border-border">
          <p className="text-xs font-mono text-muted-foreground">
            VALUES: {JSON.stringify(values, null, 2)}
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "All supported field types: text, number, email, password, textarea, checkbox, and switch.",
      },
    },
  },
};

// ============================================================================
// X-Plane Connection Form
// ============================================================================

const XPlaneConnectionFormDemo = () => {
  const [config, setConfig] = useState({
    ipAddress: "127.0.0.1",
    port: "49000",
    controlRate: "20",
    autoReconnect: true,
    safetyMonitor: true,
    recordFlights: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "connecting" | "connected">("idle");

  const validateIp = (ip: string) => {
    const pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!pattern.test(ip)) return "Invalid IP address format";
    const parts = ip.split(".").map(Number);
    if (parts.some((p) => p > 255)) return "Invalid IP address";
    return "";
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const ipError = validateIp(config.ipAddress);
    if (ipError) newErrors.ipAddress = ipError;

    const port = parseInt(config.port);
    if (isNaN(port) || port < 1024 || port > 65535) {
      newErrors.port = "Port must be 1024-65535";
    }

    const rate = parseInt(config.controlRate);
    if (isNaN(rate) || rate < 1 || rate > 50) {
      newErrors.controlRate = "Rate must be 1-50 Hz";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setStatus("connecting");
      setTimeout(() => setStatus("connected"), 1500);
    }
  };

  return (
    <form onSubmit={handleConnect} className="w-[380px] space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-primary">X-PLANE CONNECTION</h2>
        <Badge
          variant={
            status === "connected"
              ? "success"
              : status === "connecting"
              ? "warning"
              : "outline"
          }
        >
          {status === "connected"
            ? "ONLINE"
            : status === "connecting"
            ? "CONNECTING..."
            : "OFFLINE"}
        </Badge>
      </div>

      <div className="p-4 border border-border bg-card/50 space-y-4">
        <h3 className="text-xs font-mono text-muted-foreground">
          NETWORK SETTINGS
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <FormField>
            <FormLabel htmlFor="ip" required>
              IP ADDRESS
            </FormLabel>
            <Input
              id="ip"
              value={config.ipAddress}
              onChange={(e) =>
                setConfig({ ...config, ipAddress: e.target.value })
              }
              error={!!errors.ipAddress}
              className="font-mono"
              disabled={status === "connected"}
            />
            <FormMessage error>{errors.ipAddress}</FormMessage>
          </FormField>

          <FormField>
            <FormLabel htmlFor="port" required>
              UDP PORT
            </FormLabel>
            <Input
              id="port"
              type="number"
              value={config.port}
              onChange={(e) => setConfig({ ...config, port: e.target.value })}
              error={!!errors.port}
              className="font-mono"
              disabled={status === "connected"}
            />
            <FormMessage error>{errors.port}</FormMessage>
          </FormField>
        </div>

        <FormField>
          <FormLabel htmlFor="rate" required>
            CONTROL RATE (HZ)
          </FormLabel>
          <Input
            id="rate"
            type="number"
            value={config.controlRate}
            onChange={(e) =>
              setConfig({ ...config, controlRate: e.target.value })
            }
            error={!!errors.controlRate}
            className="font-mono"
            disabled={status === "connected"}
          />
          <FormDescription>
            UDP command frequency (default: 20 Hz)
          </FormDescription>
          <FormMessage error>{errors.controlRate}</FormMessage>
        </FormField>
      </div>

      <div className="p-4 border border-border bg-card/50 space-y-3">
        <h3 className="text-xs font-mono text-muted-foreground">OPTIONS</h3>

        <FormField className="flex items-center justify-between">
          <div>
            <FormLabel htmlFor="autorecon">AUTO-RECONNECT</FormLabel>
            <FormDescription>Reconnect on connection loss</FormDescription>
          </div>
          <Switch
            id="autorecon"
            checked={config.autoReconnect}
            onCheckedChange={(checked) =>
              setConfig({ ...config, autoReconnect: checked })
            }
          />
        </FormField>

        <FormField className="flex items-center justify-between">
          <div>
            <FormLabel htmlFor="safety">SAFETY MONITOR</FormLabel>
            <FormDescription>50 Hz stall/overspeed protection</FormDescription>
          </div>
          <Switch
            id="safety"
            checked={config.safetyMonitor}
            onCheckedChange={(checked) =>
              setConfig({ ...config, safetyMonitor: checked })
            }
          />
        </FormField>

        <FormField className="flex items-center justify-between">
          <div>
            <FormLabel htmlFor="record">RECORD FLIGHTS</FormLabel>
            <FormDescription>Save flight data to disk</FormDescription>
          </div>
          <Switch
            id="record"
            checked={config.recordFlights}
            onCheckedChange={(checked) =>
              setConfig({ ...config, recordFlights: checked })
            }
          />
        </FormField>
      </div>

      <div className="flex gap-2">
        {status === "connected" ? (
          <Button
            type="button"
            variant="destructive"
            onClick={() => setStatus("idle")}
          >
            DISCONNECT
          </Button>
        ) : (
          <Button type="submit" disabled={status === "connecting"}>
            {status === "connecting" ? "CONNECTING..." : "CONNECT"}
          </Button>
        )}
        <Button type="button" variant="outline" disabled={status === "connected"}>
          TEST CONNECTION
        </Button>
      </div>
    </form>
  );
};

export const XPlaneConnection: Story = {
  render: () => <XPlaneConnectionFormDemo />,
  args: { children: null },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "X-Plane UDP connection configuration form with IP validation, port settings, and connection status.",
      },
    },
  },
};

// ============================================================================
// Inline Form Layout
// ============================================================================

export const InlineForm: Story = {
  args: { children: null },
  render: () => {
    const [search, setSearch] = useState("");

    return (
      <div className="w-[500px] space-y-6">
        <h3 className="font-display text-lg text-foreground">INLINE FORMS</h3>

        <div className="flex items-end gap-2">
          <FormField className="flex-1">
            <FormLabel htmlFor="search">SEARCH FLIGHTS</FormLabel>
            <Input
              id="search"
              placeholder="Enter callsign or route..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </FormField>
          <Button type="button">SEARCH</Button>
        </div>

        <div className="flex items-end gap-2">
          <FormField className="w-24">
            <FormLabel htmlFor="qty">QTY</FormLabel>
            <Input id="qty" type="number" defaultValue="1" className="font-mono" />
          </FormField>
          <FormField className="flex-1">
            <FormLabel htmlFor="item">ITEM CODE</FormLabel>
            <Input id="item" placeholder="Enter item..." className="font-mono" />
          </FormField>
          <Button type="button" variant="outline">
            ADD
          </Button>
        </div>

        <div className="p-4 border border-border bg-card/50">
          <div className="flex items-center gap-4">
            <FormField className="flex-1">
              <Input placeholder="Enter waypoint..." className="font-mono" />
            </FormField>
            <Button type="button" size="sm">
              INSERT
            </Button>
            <Button type="button" size="sm" variant="ghost">
              CLEAR
            </Button>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: "Inline form layouts for search bars and quick-add interfaces.",
      },
    },
  },
};

// ============================================================================
// All Form Components
// ============================================================================

export const AllComponents: Story = {
  args: { children: null },
  render: () => (
    <div className="w-[400px] space-y-6">
      <h3 className="font-display text-lg text-foreground">
        FORM COMPONENT ANATOMY
      </h3>

      <div className="p-4 border border-border bg-card/50 space-y-6">
        <FormField>
          <FormLabel htmlFor="demo" required>
            FORM LABEL
            <span className="ml-2 text-xs text-muted-foreground font-normal">
              (with required indicator)
            </span>
          </FormLabel>
          <Input
            id="demo"
            placeholder="Input placeholder text..."
            aria-describedby="demo-desc demo-msg"
          />
          <FormDescription id="demo-desc">
            FormDescription: Helper text explaining the field
          </FormDescription>
          <FormMessage id="demo-msg">
            FormMessage: Neutral message (no error prop)
          </FormMessage>
        </FormField>

        <FormField>
          <FormLabel htmlFor="demo-error" required>
            FIELD WITH ERROR
          </FormLabel>
          <Input
            id="demo-error"
            value="Invalid input"
            error
            aria-describedby="demo-error-msg"
          />
          <FormMessage error id="demo-error-msg">
            FormMessage with error prop: This field has an error
          </FormMessage>
        </FormField>

        <div className="pt-4 border-t border-border space-y-2">
          <p className="text-xs font-mono text-muted-foreground">COMPONENTS:</p>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>
              <code className="text-primary">FormField</code> - Wrapper with
              spacing
            </li>
            <li>
              <code className="text-primary">FormLabel</code> - Accessible label
              with required indicator
            </li>
            <li>
              <code className="text-primary">FormDescription</code> - Help text
            </li>
            <li>
              <code className="text-primary">FormMessage</code> - Error/info
              message with role=alert
            </li>
          </ul>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Overview of all Form subcomponents: FormField, FormLabel, FormDescription, and FormMessage.",
      },
    },
  },
};
