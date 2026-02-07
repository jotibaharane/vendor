// VehicleCard.tsx
import { ValidationResult } from '@store/slices/validatedVehiclesSlice';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text, TextInput } from 'react-native-paper';
import { getStatusConfig } from '../helper';
import { VehicleItem } from '../type';

interface Props {
  item: VehicleItem;
  validatingId: string | null;
  handleValidate: (vehicle: VehicleItem) => void;
  validationStatus?: ValidationResult;
}

export const VehicleCard: React.FC<Props> = React.memo(
  ({ item, validatingId, handleValidate, validationStatus }) => {
    const status = getStatusConfig(validationStatus);
    const loading = validatingId === item.VehicleNumber;
    console.log({ item });
    return (
      <Card style={styles.card} elevation={1}>
        <Card.Content style={styles.content}>
          {/* ROW 1: Header with ID and Validate button */}
          {/* <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text variant="titleMedium" style={styles.vehicleId}>
                {item.VehicleNumber}
              </Text>
              {status.text && (
                <Chip
                  compact
                  icon={status.icon}
                  style={[styles.statusChip, { borderColor: status.color }]}
                  textStyle={[styles.statusText, { color: status.color }]}
                >
                  {status.text}
                </Chip>
              )}
            </View>
            <View>
              <Button
                mode="contained"
                compact
                loading={loading}
                onPress={() => handleValidate(item)}
                style={styles.validateBtn}
                // contentStyle={styles.btnContent}
                labelStyle={styles.btnLabel}
              >
                Validate
              </Button>
            </View>
          </View> */}

          {/* ROW 2: Input fields */}
          <View style={styles.inputsRow}>
            <View style={styles.inputGroup}>
              <FieldWithLabel
                label="Vehicle No"
                placeholder="kg"
                keyboardType="numeric"
                value={item.VehicleNumber}
              />
              <FieldWithLabel
                label="Weight"
                placeholder="kg"
                keyboardType="numeric"
              />
              <FieldWithLabel label="Segment" />
            </View>
            <View style={styles.inputGroup}>
              <FieldWithLabel label="Body Type" style={{ marginTop: 12 }} />
              <View style={styles.dimensionsGroup}>
                <View style={styles.dimensionsHeader}>
                  <Text variant="labelSmall" style={styles.dimensionsLabel}>
                    Dimensions
                  </Text>
                </View>
                <View style={styles.dimensionsInputs}>
                  <CompactField placeholder="W" keyboardType="numeric" />
                  <Text style={styles.divider}>×</Text>
                  <CompactField placeholder="H" keyboardType="numeric" />
                  <Text style={styles.divider}>×</Text>
                  <CompactField placeholder="L" keyboardType="numeric" />
                </View>
              </View>
            </View>
            <View>
              <Button
                mode="contained"
                compact
                loading={loading}
                onPress={() => handleValidate(item)}
                style={styles.validateBtn}
                // contentStyle={styles.btnContent}
                labelStyle={styles.btnLabel}
              >
                Validate
              </Button>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  },
);

// Subcomponents
const FieldWithLabel = ({ label, ...props }: any) => (
  <View style={styles.fieldContainer}>
    {/* <Text variant="labelSmall" style={styles.fieldLabel}>
      {label}
    </Text> */}
    <TextInput
      mode="outlined"
      label={label}
      dense
      style={styles.fieldInput}
      contentStyle={styles.fieldInputContent}
      outlineStyle={styles.fieldOutline}
      {...props}
    />
  </View>
);

const CompactField = ({ ...props }: any) => (
  <TextInput
    mode="outlined"
    dense
    style={styles.compactInput}
    contentStyle={styles.compactInputContent}
    outlineStyle={styles.compactOutline}
    {...props}
  />
);

// Styles
const styles = StyleSheet.create({
  card: {
    marginHorizontal: 8,
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vehicleId: {
    fontWeight: '700',
    color: '#1f2937',
  },
  statusChip: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  statusText: {
    // fontSize: 10,
    // fontWeight: '600',
  },
  validateBtn: {
    borderRadius: 6,
    minWidth: 80,
  },
  btnContent: {
    height: 32,
  },
  btnLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  inputsRow: {
    gap: 12,
  },
  inputGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  fieldContainer: {
    flex: 1,
  },
  fieldLabel: {
    marginBottom: 4,
    color: '#6b7280',
    fontWeight: '500',
  },
  fieldInput: {
    height: 38,
  },
  fieldInputContent: {
    fontSize: 11.5,
    paddingVertical: 0,
  },
  fieldOutline: {
    borderRadius: 6,
  },
  dimensionsGroup: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    // padding: 10,
  },
  dimensionsHeader: {
    marginBottom: 6,
  },
  dimensionsLabel: {
    color: '#475569',
    fontWeight: '600',
  },
  dimensionsInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  compactInput: {
    width: 60,
    height: 36,
  },
  compactInputContent: {
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 0,
  },
  compactOutline: {
    borderRadius: 5,
  },
  divider: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
});
